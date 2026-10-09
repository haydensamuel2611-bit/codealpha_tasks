const fs = require('fs');

let content = fs.readFileSync('public/js/app.js', 'utf8');

const closeOrdersModalDef = `
function closeOrdersModal() {
  const modal = (typeof elements !== 'undefined' && elements.ordersHistoryModal) || document.getElementById('orders-history-modal');
  if (modal) {
    modal.classList.remove('active');
    document.body.style.overflow = '';
  }
}
window.closeOrdersModal = closeOrdersModal;
`;

if (!content.includes('function closeOrdersModal()')) {
  content = content.replace(
    '// ================= AUTH MODAL =================',
    closeOrdersModalDef + '\n// ================= AUTH MODAL ================='
  );
}

fs.writeFileSync('public/js/app.js', content, 'utf8');
fs.writeFileSync('js/app.js', content, 'utf8');
console.log('closeOrdersModal added!');
