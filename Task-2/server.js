const express = require('express');
const cors = require('cors');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const { db, initDatabase } = require('./db/database');
const { seedDatabase } = require('./db/seed');

// Initialize database
initDatabase();
seedDatabase();

const app = express();
const PORT = process.env.PORT || 3000;

// Ensure upload directory exists
const uploadDir = path.join(__dirname, 'public', 'uploads');
if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir, { recursive: true });
}

// Multer storage configuration
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, uploadDir);
  },
  filename: (req, file, cb) => {
    const ext = path.extname(file.originalname).toLowerCase();
    const uniqueName = `${Date.now()}-${Math.round(Math.random() * 1e9)}${ext}`;
    cb(null, uniqueName);
  }
});

const upload = multer({
  storage,
  limits: { fileSize: 10 * 1024 * 1024 }, // 10MB limit
  fileFilter: (req, file, cb) => {
    if (file.mimetype.startsWith('image/')) {
      cb(null, true);
    } else {
      cb(new Error('Only image files are allowed!'), false);
    }
  }
});

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.join(__dirname, 'public')));
app.use(express.static(__dirname));

// Health check endpoint for frontend connection verification
app.get('/api/health', (req, res) => {
  try {
    const userCount = db.prepare('SELECT COUNT(*) AS count FROM users').get().count;
    const postCount = db.prepare('SELECT COUNT(*) AS count FROM posts').get().count;
    res.json({
      status: 'connected',
      message: 'Pulse Backend & Database are fully operational!',
      stats: { users: userCount, posts: postCount },
      timestamp: new Date().toISOString()
    });
  } catch (err) {
    res.status(500).json({ status: 'error', error: err.message });
  }
});

// Helper to get current user ID from query or header
function getRequesterId(req) {
  const headerId = req.headers['x-user-id'];
  const queryId = req.query.current_user_id;
  const parsed = parseInt(headerId || queryId, 10);
  return isNaN(parsed) ? 1 : parsed;
}

// -------------------------------------------------------------
// AUTHENTICATION & LOGIN ROUTES
// -------------------------------------------------------------

// Login with username / password or quick demo select
app.post('/api/auth/login', (req, res) => {
  try {
    const { username } = req.body;
    if (!username || !username.trim()) {
      return res.status(400).json({ success: false, error: 'Username is required' });
    }

    const cleanUsername = username.replace(/^@/, '').trim().toLowerCase();
    const user = db.prepare(`
      SELECT 
        u.*,
        (SELECT COUNT(*) FROM posts WHERE user_id = u.id) AS posts_count,
        (SELECT COUNT(*) FROM followers WHERE following_id = u.id) AS followers_count,
        (SELECT COUNT(*) FROM followers WHERE follower_id = u.id) AS following_count
      FROM users u
      WHERE LOWER(u.username) = ?
    `).get(cleanUsername);

    if (!user) {
      return res.status(404).json({ 
        success: false, 
        error: `User "@${cleanUsername}" was not found. Try one of our demo creators or sign up!` 
      });
    }

    res.json({ success: true, user, message: `Welcome back, ${user.display_name}!` });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Force database re-seed endpoint
app.post('/api/seed', (req, res) => {
  try {
    seedDatabase(true);
    res.json({ success: true, message: 'Database successfully re-seeded with fresh reels, memes & creators!' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// USER ROUTES
// -------------------------------------------------------------

// List all users
app.get('/api/users', (req, res) => {
  try {
    const currentUserId = getRequesterId(req);
    const users = db.prepare(`
      SELECT 
        u.*,
        (SELECT COUNT(*) FROM posts WHERE user_id = u.id) AS posts_count,
        (SELECT COUNT(*) FROM followers WHERE following_id = u.id) AS followers_count,
        (SELECT COUNT(*) FROM followers WHERE follower_id = u.id) AS following_count,
        EXISTS(SELECT 1 FROM followers WHERE follower_id = ? AND following_id = u.id) AS is_following
      FROM users u
      ORDER BY followers_count DESC, u.id ASC
    `).all(currentUserId);

    res.json({ success: true, data: users });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get single user profile
app.get('/api/users/:id', (req, res) => {
  try {
    const targetUserId = parseInt(req.params.id, 10);
    const currentUserId = getRequesterId(req);

    const user = db.prepare(`
      SELECT 
        u.*,
        (SELECT COUNT(*) FROM posts WHERE user_id = u.id) AS posts_count,
        (SELECT COUNT(*) FROM followers WHERE following_id = u.id) AS followers_count,
        (SELECT COUNT(*) FROM followers WHERE follower_id = u.id) AS following_count,
        EXISTS(SELECT 1 FROM followers WHERE follower_id = ? AND following_id = u.id) AS is_following
      FROM users u
      WHERE u.id = ?
    `).get(currentUserId, targetUserId);

    if (!user) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    res.json({ success: true, data: user });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Create new user (register)
app.post('/api/users', (req, res) => {
  try {
    const { username, display_name, bio, avatar, banner, location, website } = req.body;
    if (!username || !display_name) {
      return res.status(400).json({ success: false, error: 'Username and display name are required' });
    }

    const cleanUsername = username.toLowerCase().replace(/[^a-z0-9_]/g, '');
    const defaultAvatar = `https://api.dicebear.com/7.x/bottts/svg?seed=${cleanUsername}`;
    const defaultBanner = 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?w=1200&auto=format&fit=crop&q=80';

    const insert = db.prepare(`
      INSERT INTO users (username, display_name, bio, avatar, banner, location, website)
      VALUES (?, ?, ?, ?, ?, ?, ?)
    `);

    const result = insert.run(
      cleanUsername,
      display_name.trim(),
      (bio || '').trim(),
      avatar || defaultAvatar,
      banner || defaultBanner,
      (location || '').trim(),
      (website || '').trim()
    );

    const newUser = db.prepare('SELECT * FROM users WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json({ success: true, data: newUser });
  } catch (err) {
    if (err.message.includes('UNIQUE constraint failed')) {
      return res.status(409).json({ success: false, error: 'Username already taken' });
    }
    res.status(500).json({ success: false, error: err.message });
  }
});

// Update user profile
app.put('/api/users/:id', (req, res) => {
  try {
    const userId = parseInt(req.params.id, 10);
    const { display_name, bio, avatar, banner, location, website } = req.body;

    const existing = db.prepare('SELECT id FROM users WHERE id = ?').get(userId);
    if (!existing) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    db.prepare(`
      UPDATE users 
      SET 
        display_name = COALESCE(?, display_name),
        bio = COALESCE(?, bio),
        avatar = COALESCE(?, avatar),
        banner = COALESCE(?, banner),
        location = COALESCE(?, location),
        website = COALESCE(?, website)
      WHERE id = ?
    `).run(
      display_name !== undefined ? display_name.trim() : null,
      bio !== undefined ? bio.trim() : null,
      avatar !== undefined ? avatar.trim() : null,
      banner !== undefined ? banner.trim() : null,
      location !== undefined ? location.trim() : null,
      website !== undefined ? website.trim() : null,
      userId
    );

    const updated = db.prepare(`
      SELECT 
        u.*,
        (SELECT COUNT(*) FROM posts WHERE user_id = u.id) AS posts_count,
        (SELECT COUNT(*) FROM followers WHERE following_id = u.id) AS followers_count,
        (SELECT COUNT(*) FROM followers WHERE follower_id = u.id) AS following_count
      FROM users u
      WHERE u.id = ?
    `).get(userId);

    res.json({ success: true, data: updated });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Follow / Unfollow toggle
app.post('/api/users/:id/follow', (req, res) => {
  try {
    const targetUserId = parseInt(req.params.id, 10);
    const currentUserId = getRequesterId(req);

    if (targetUserId === currentUserId) {
      return res.status(400).json({ success: false, error: 'You cannot follow yourself' });
    }

    const targetUser = db.prepare('SELECT id FROM users WHERE id = ?').get(targetUserId);
    if (!targetUser) {
      return res.status(404).json({ success: false, error: 'User not found' });
    }

    const existingFollow = db.prepare(`
      SELECT id FROM followers WHERE follower_id = ? AND following_id = ?
    `).get(currentUserId, targetUserId);

    let isFollowing = false;
    if (existingFollow) {
      db.prepare('DELETE FROM followers WHERE follower_id = ? AND following_id = ?').run(currentUserId, targetUserId);
      isFollowing = false;
    } else {
      db.prepare('INSERT INTO followers (follower_id, following_id) VALUES (?, ?)').run(currentUserId, targetUserId);
      isFollowing = true;
    }

    const countResult = db.prepare('SELECT COUNT(*) AS count FROM followers WHERE following_id = ?').get(targetUserId);

    res.json({
      success: true,
      data: {
        is_following: isFollowing,
        followers_count: countResult.count,
        target_user_id: targetUserId
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get user followers
app.get('/api/users/:id/followers', (req, res) => {
  try {
    const targetUserId = parseInt(req.params.id, 10);
    const currentUserId = getRequesterId(req);

    const followers = db.prepare(`
      SELECT 
        u.id, u.username, u.display_name, u.avatar, u.bio,
        EXISTS(SELECT 1 FROM followers WHERE follower_id = ? AND following_id = u.id) AS is_following
      FROM followers f
      JOIN users u ON f.follower_id = u.id
      WHERE f.following_id = ?
      ORDER BY f.created_at DESC
    `).all(currentUserId, targetUserId);

    res.json({ success: true, data: followers });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get user following
app.get('/api/users/:id/following', (req, res) => {
  try {
    const targetUserId = parseInt(req.params.id, 10);
    const currentUserId = getRequesterId(req);

    const following = db.prepare(`
      SELECT 
        u.id, u.username, u.display_name, u.avatar, u.bio,
        EXISTS(SELECT 1 FROM followers WHERE follower_id = ? AND following_id = u.id) AS is_following
      FROM followers f
      JOIN users u ON f.following_id = u.id
      WHERE f.follower_id = ?
      ORDER BY f.created_at DESC
    `).all(currentUserId, targetUserId);

    res.json({ success: true, data: following });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// POSTS ROUTES
// -------------------------------------------------------------

// Get posts with filtering
app.get('/api/posts', (req, res) => {
  try {
    const currentUserId = getRequesterId(req);
    const { feed, user_id, liked_by, tag, search } = req.query;

    let baseQuery = `
      SELECT 
        p.*,
        u.username AS author_username,
        u.display_name AS author_name,
        u.avatar AS author_avatar,
        (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS likes_count,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS comments_count,
        EXISTS(SELECT 1 FROM likes WHERE user_id = ? AND post_id = p.id) AS is_liked,
        EXISTS(SELECT 1 FROM bookmarks WHERE user_id = ? AND post_id = p.id) AS is_bookmarked,
        EXISTS(SELECT 1 FROM followers WHERE follower_id = ? AND following_id = p.user_id) AS is_following_author
      FROM posts p
      JOIN users u ON p.user_id = u.id
    `;

    const params = [currentUserId, currentUserId, currentUserId];
    const conditions = [];

    if (user_id) {
      conditions.push('p.user_id = ?');
      params.push(parseInt(user_id, 10));
    } else if (liked_by) {
      conditions.push('p.id IN (SELECT post_id FROM likes WHERE user_id = ?)');
      params.push(parseInt(liked_by, 10));
    } else if (feed === 'following') {
      conditions.push('(p.user_id IN (SELECT following_id FROM followers WHERE follower_id = ?) OR p.user_id = ?)');
      params.push(currentUserId, currentUserId);
    } else if (feed === 'bookmarks') {
      conditions.push('p.id IN (SELECT post_id FROM bookmarks WHERE user_id = ?)');
      params.push(currentUserId);
    } else if (feed === 'reels') {
      conditions.push("(p.image_url LIKE '%.mp4' OR p.image_url LIKE '%.webm' OR p.tags LIKE '%reel%')");
    } else if (feed === 'memes') {
      conditions.push("(p.tags LIKE '%meme%' OR p.image_url LIKE '%/memes/%')");
    } else if (tag) {
      conditions.push('p.tags LIKE ?');
      params.push(`%${tag}%`);
    } else if (search) {
      conditions.push('(p.content LIKE ? OR u.display_name LIKE ? OR u.username LIKE ?)');
      const s = `%${search}%`;
      params.push(s, s, s);
    }

    if (conditions.length > 0) {
      baseQuery += ' WHERE ' + conditions.join(' AND ');
    }

    if (feed === 'trending') {
      baseQuery += ' ORDER BY likes_count DESC, p.created_at DESC LIMIT 50';
    } else {
      baseQuery += ' ORDER BY p.created_at DESC LIMIT 50';
    }

    const posts = db.prepare(baseQuery).all(...params);
    res.json({ success: true, data: posts });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Get single post
app.get('/api/posts/:id', (req, res) => {
  try {
    const postId = parseInt(req.params.id, 10);
    const currentUserId = getRequesterId(req);

    const post = db.prepare(`
      SELECT 
        p.*,
        u.username AS author_username,
        u.display_name AS author_name,
        u.avatar AS author_avatar,
        (SELECT COUNT(*) FROM likes WHERE post_id = p.id) AS likes_count,
        (SELECT COUNT(*) FROM comments WHERE post_id = p.id) AS comments_count,
        EXISTS(SELECT 1 FROM likes WHERE user_id = ? AND post_id = p.id) AS is_liked,
        EXISTS(SELECT 1 FROM bookmarks WHERE user_id = ? AND post_id = p.id) AS is_bookmarked,
        EXISTS(SELECT 1 FROM followers WHERE follower_id = ? AND following_id = p.user_id) AS is_following_author
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `).get(currentUserId, currentUserId, currentUserId, postId);

    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    res.json({ success: true, data: post });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Create new post
app.post('/api/posts', (req, res) => {
  try {
    const currentUserId = getRequesterId(req);
    const { content, image_url, tags } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, error: 'Post content cannot be empty' });
    }

    let extractedTags = tags || '';
    if (!extractedTags) {
      const tagMatches = content.match(/#[a-zA-Z0-9_]+/g);
      if (tagMatches) {
        extractedTags = tagMatches.map(t => t.replace('#', '').toLowerCase()).join(',');
      }
    }

    const insert = db.prepare(`
      INSERT INTO posts (user_id, content, image_url, tags)
      VALUES (?, ?, ?, ?)
    `);

    const result = insert.run(currentUserId, content.trim(), image_url || '', extractedTags);
    const newPostId = result.lastInsertRowid;

    const newPost = db.prepare(`
      SELECT 
        p.*,
        u.username AS author_username,
        u.display_name AS author_name,
        u.avatar AS author_avatar,
        0 AS likes_count,
        0 AS comments_count,
        0 AS is_liked,
        0 AS is_bookmarked,
        0 AS is_following_author
      FROM posts p
      JOIN users u ON p.user_id = u.id
      WHERE p.id = ?
    `).get(newPostId);

    res.status(201).json({ success: true, data: newPost });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete post
app.delete('/api/posts/:id', (req, res) => {
  try {
    const postId = parseInt(req.params.id, 10);
    const currentUserId = getRequesterId(req);

    const post = db.prepare('SELECT user_id FROM posts WHERE id = ?').get(postId);
    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    if (post.user_id !== currentUserId) {
      return res.status(403).json({ success: false, error: 'Unauthorized to delete this post' });
    }

    db.prepare('DELETE FROM posts WHERE id = ?').run(postId);
    res.json({ success: true, message: 'Post deleted successfully' });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// LIKES & BOOKMARKS ROUTES
// -------------------------------------------------------------

// Toggle Like / Unlike
app.post('/api/posts/:id/like', (req, res) => {
  try {
    const postId = parseInt(req.params.id, 10);
    const currentUserId = getRequesterId(req);

    const post = db.prepare('SELECT id FROM posts WHERE id = ?').get(postId);
    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    const existingLike = db.prepare(`
      SELECT id FROM likes WHERE user_id = ? AND post_id = ?
    `).get(currentUserId, postId);

    let isLiked = false;
    if (existingLike) {
      db.prepare('DELETE FROM likes WHERE user_id = ? AND post_id = ?').run(currentUserId, postId);
      isLiked = false;
    } else {
      db.prepare('INSERT INTO likes (user_id, post_id) VALUES (?, ?)').run(currentUserId, postId);
      isLiked = true;
    }

    const likesCountResult = db.prepare('SELECT COUNT(*) AS count FROM likes WHERE post_id = ?').get(postId);

    res.json({
      success: true,
      data: {
        is_liked: isLiked,
        likes_count: likesCountResult.count,
        post_id: postId
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Toggle Bookmark
app.post('/api/posts/:id/bookmark', (req, res) => {
  try {
    const postId = parseInt(req.params.id, 10);
    const currentUserId = getRequesterId(req);

    const existingBookmark = db.prepare(`
      SELECT id FROM bookmarks WHERE user_id = ? AND post_id = ?
    `).get(currentUserId, postId);

    let isBookmarked = false;
    if (existingBookmark) {
      db.prepare('DELETE FROM bookmarks WHERE user_id = ? AND post_id = ?').run(currentUserId, postId);
      isBookmarked = false;
    } else {
      db.prepare('INSERT INTO bookmarks (user_id, post_id) VALUES (?, ?)').run(currentUserId, postId);
      isBookmarked = true;
    }

    res.json({
      success: true,
      data: {
        is_bookmarked: isBookmarked,
        post_id: postId
      }
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// COMMENTS ROUTES
// -------------------------------------------------------------

// Get comments for a post
app.get('/api/posts/:id/comments', (req, res) => {
  try {
    const postId = parseInt(req.params.id, 10);
    const comments = db.prepare(`
      SELECT 
        c.*,
        u.username AS author_username,
        u.display_name AS author_name,
        u.avatar AS author_avatar
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.post_id = ?
      ORDER BY c.created_at ASC
    `).all(postId);

    res.json({ success: true, data: comments });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Add comment to a post
app.post('/api/posts/:id/comments', (req, res) => {
  try {
    const postId = parseInt(req.params.id, 10);
    const currentUserId = getRequesterId(req);
    const { content } = req.body;

    if (!content || !content.trim()) {
      return res.status(400).json({ success: false, error: 'Comment content cannot be empty' });
    }

    const post = db.prepare('SELECT id FROM posts WHERE id = ?').get(postId);
    if (!post) {
      return res.status(404).json({ success: false, error: 'Post not found' });
    }

    const insert = db.prepare(`
      INSERT INTO comments (post_id, user_id, content)
      VALUES (?, ?, ?)
    `);

    const result = insert.run(postId, currentUserId, content.trim());
    const newCommentId = result.lastInsertRowid;

    const newComment = db.prepare(`
      SELECT 
        c.*,
        u.username AS author_username,
        u.display_name AS author_name,
        u.avatar AS author_avatar
      FROM comments c
      JOIN users u ON c.user_id = u.id
      WHERE c.id = ?
    `).get(newCommentId);

    const countResult = db.prepare('SELECT COUNT(*) AS count FROM comments WHERE post_id = ?').get(postId);

    res.status(201).json({
      success: true,
      data: newComment,
      comments_count: countResult.count
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Delete comment
app.delete('/api/comments/:id', (req, res) => {
  try {
    const commentId = parseInt(req.params.id, 10);
    const currentUserId = getRequesterId(req);

    const comment = db.prepare('SELECT user_id, post_id FROM comments WHERE id = ?').get(commentId);
    if (!comment) {
      return res.status(404).json({ success: false, error: 'Comment not found' });
    }

    if (comment.user_id !== currentUserId) {
      return res.status(403).json({ success: false, error: 'Unauthorized to delete this comment' });
    }

    db.prepare('DELETE FROM comments WHERE id = ?').run(commentId);
    const countResult = db.prepare('SELECT COUNT(*) AS count FROM comments WHERE post_id = ?').get(comment.post_id);

    res.json({
      success: true,
      message: 'Comment deleted',
      comments_count: countResult.count,
      post_id: comment.post_id
    });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// -------------------------------------------------------------
// IMAGE UPLOAD ROUTE
// -------------------------------------------------------------
app.post('/api/upload', upload.single('image'), (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ success: false, error: 'No image file uploaded' });
    }
    const fileUrl = `/uploads/${req.file.filename}`;
    res.json({ success: true, url: fileUrl });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Trending hashtags endpoint
app.get('/api/trends', (req, res) => {
  try {
    const postsWithTags = db.prepare("SELECT tags FROM posts WHERE tags != ''").all();
    const tagMap = {};

    postsWithTags.forEach(p => {
      const tags = p.tags.split(',').map(t => t.trim().toLowerCase()).filter(Boolean);
      tags.forEach(t => {
        tagMap[t] = (tagMap[t] || 0) + 1;
      });
    });

    const trends = Object.entries(tagMap)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 6);

    res.json({ success: true, data: trends });
  } catch (err) {
    res.status(500).json({ success: false, error: err.message });
  }
});

// Fallback to SPA index.html for non-API routes
app.use((req, res, next) => {
  if (req.path.startsWith('/api')) {
    return res.status(404).json({ success: false, error: 'Endpoint not found' });
  }
  res.sendFile(path.join(__dirname, 'public', 'index.html'));
});

// Start Server
app.listen(PORT, '0.0.0.0', () => {
  console.log(`✨ Social Pulse Server running smoothly on port ${PORT}`);
});
