import { useState, useEffect, useRef } from 'react'
import { supabase } from './supabase'
// --- Global CSS ---
const globalStyle = `
  @import url('https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700&display=swap');
  html, body, #root { max-width: 100% !important; width: 100% !important; margin: 0 !important; padding: 0 !important; text-align: left !important; }
  * { box-sizing: border-box; font-family: 'Inter', sans-serif; }
  body { background: #020617; background-image: radial-gradient(circle at 80% 20%, #0f172a 0%, #020617 80%); color: #e2e8f0; min-height: 100vh; overflow-x: hidden; }
  ::-webkit-scrollbar { width: 6px; height: 6px; }
  ::-webkit-scrollbar-track { background: transparent; }
  ::-webkit-scrollbar-thumb { background: #1e293b; border-radius: 10px; }
  ::-webkit-scrollbar-thumb:hover { background: #334155; }

  /* Dashboard Layout */
  .dashboard-layout { display: flex; width: 100vw; height: 100vh; overflow: hidden; }

  /* Sidebar Styling */
  .sidebar { width: 260px; flex-shrink: 0; background: #090d16; border-right: 1px solid rgba(255, 255, 255, 0.05); padding: 24px 16px; display: flex; flex-direction: column; gap: 20px; overflow-y: auto; }
  .brand-section { display: flex; align-items: center; gap: 12px; padding: 0 8px; margin-bottom: 8px; }
  .brand-title { font-weight: 700; font-size: 16px; color: #fff; letter-spacing: 0.5px; }
  .brand-status { font-size: 11px; color: #10b981; display: flex; align-items: center; gap: 6px; margin-top: 2px; }
  .sidebar-category { font-size: 10px; font-weight: 700; color: #475569; text-transform: uppercase; letter-spacing: 1.5px; margin: 16px 8px 8px 8px; }

  /* Sidebar Navigation Items */
  .sidebar-item { padding: 10px 14px; border-radius: 8px; cursor: pointer; transition: all 0.2s ease; margin-bottom: 4px; display: flex; justify-content: space-between; align-items: center; color: #94a3b8; font-size: 14px; font-weight: 500; border: 1px solid transparent; }
  .sidebar-item:hover { background: rgba(255, 255, 255, 0.03); color: #f8fafc; }
  .sidebar-item.active { background: rgba(99, 102, 241, 0.15); border: 1px solid rgba(99, 102, 241, 0.2); color: #fff; font-weight: 600; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.05); }
  .sidebar-item-content { display: flex; align-items: center; gap: 10px; }

  /* Buttons in Sidebar */
  .btn-sidebar-primary { background: linear-gradient(135deg, #6366f1, #3b82f6); color: white; padding: 10px 16px; border-radius: 8px; font-weight: 600; font-size: 13px; cursor: pointer; border: none; transition: all 0.2s ease; box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2); display: flex; align-items: center; justify-content: center; gap: 8px; }
  .btn-sidebar-primary:hover { filter: brightness(1.1); box-shadow: 0 6px 16px rgba(99, 102, 241, 0.3); }
  .btn-sidebar-secondary { background: rgba(99, 102, 241, 0.08); border: 1px solid rgba(99, 102, 241, 0.15); color: #a5b4fc; padding: 10px 16px; border-radius: 8px; font-weight: 500; font-size: 13px; cursor: pointer; transition: all 0.2s ease; display: flex; align-items: center; justify-content: center; gap: 8px; }
  .btn-sidebar-secondary:hover { background: rgba(99, 102, 241, 0.15); color: #fff; }

  /* Main Content Styling */
  .main-content { flex: 1; padding: 28px 40px; overflow-y: auto; background: #020617; }
  .content-wrapper { width: 100%; max-width: 1200px; margin: 0 auto; }
  .header-section { display: flex; justify-content: space-between; align-items: flex-start; margin-bottom: 28px; }
  .header-title-container { display: flex; flex-direction: column; gap: 6px; }
  .header-title { font-size: 28px; font-weight: 800; color: #fff; margin: 0; display: flex; align-items: center; gap: 8px; }
  .pro-badge { background: #6366f1; color: #fff; font-size: 11px; font-weight: 700; padding: 2px 6px; border-radius: 6px; text-transform: uppercase; margin-left: 6px; }
  .header-subtitle { font-size: 13px; color: #64748b; display: flex; align-items: center; gap: 6px; }
  .header-actions { display: flex; gap: 12px; align-items: center; }

  /* Buttons */
  .btn-icon-only { background: #0f172a; border: 1px solid #1e293b; color: #94a3b8; width: 38px; height: 38px; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; }
  .btn-icon-only:hover { background: #1e293b; color: #fff; }
  .btn-edit-recipe { background: #6366f1; color: #fff; border: none; border-radius: 8px; padding: 8px 16px; font-weight: 600; font-size: 13.5px; cursor: pointer; display: flex; align-items: center; gap: 8px; transition: all 0.2s; }
  .btn-edit-recipe:hover { background: #4f46e5; }
  .btn-edit-recipe.btn-success { background: #10b981; }
  .btn-edit-recipe.btn-success:hover { background: #059669; }

  /* Glass panels & cards */
  .glass-panel { background: rgba(15, 23, 42, 0.4); backdrop-filter: blur(12px); -webkit-backdrop-filter: blur(12px); border: 1px solid rgba(255, 255, 255, 0.05); box-shadow: 0 8px 32px 0 rgba(0, 0, 0, 0.2); border-radius: 12px; padding: 20px; }

  /* Stats Cards */
  .top-stats-grid { display: grid; grid-template-columns: repeat(auto-fit, minmax(300px, 1fr)); gap: 20px; margin-bottom: 28px; }
  .stat-card { background: #090e1a; border: 1px solid rgba(255, 255, 255, 0.03); border-radius: 12px; padding: 16px 20px; display: flex; flex-direction: column; justify-content: space-between; gap: 12px; min-height: 120px; }
  .stat-card-title { color: #64748b; font-size: 12px; font-weight: 600; letter-spacing: 0.5px; }
  .stat-card-desc { color: #475569; font-size: 11px; }

  /* Input elements with prefix */
  .input-prefix-container { display: flex; align-items: center; background: rgba(0, 0, 0, 0.3); border: 1px solid #1e293b; border-radius: 8px; overflow: hidden; transition: all 0.2s ease; width: 100%; }
  .input-prefix-container:focus-within { border-color: #6366f1; box-shadow: 0 0 0 3px rgba(99, 102, 241, 0.15); }
  .input-prefix-icon { padding: 10px 14px; color: #64748b; font-weight: 600; font-size: 15px; background: rgba(255, 255, 255, 0.02); border-right: 1px solid #1e293b; user-select: none; }
  .pro-input-field { background: transparent; border: none; color: #fff; padding: 10px 14px; outline: none; font-size: 14px; width: 100%; font-weight: 500; }
  .pro-input-field::placeholder { color: #475569; }

  /* Currency Conversion Card Specifics */
  .conversion-card { border-color: rgba(16, 185, 129, 0.1); }
  .conversion-card-title { color: #10b981; }
  .conversion-inputs-row { display: flex; align-items: center; gap: 12px; }
  .conversion-input-box { background: rgba(0, 0, 0, 0.3); border: 1px solid #1e293b; border-radius: 8px; color: #fff; padding: 10px 14px; font-size: 14px; outline: none; width: 100%; font-weight: 500; text-align: center; }
  .conversion-input-box::placeholder { color: #475569; }
  .conversion-input-box:focus { border-color: #10b981; }
  .conversion-equals { color: #475569; font-weight: bold; }
  .btn-swap-calc { background: #0f172a; border: 1px solid #1e293b; color: #64748b; width: 38px; height: 38px; border-radius: 8px; display: flex; align-items: center; justify-content: center; cursor: pointer; transition: all 0.2s; flex-shrink: 0; }
  .btn-swap-calc:hover { border-color: #10b981; color: #10b981; background: rgba(16, 185, 129, 0.05); }

  /* Content Grid Layout */
  .content-grid { display: grid; grid-template-columns: 1fr 1.35fr; gap: 24px; align-items: flex-start; margin-bottom: 24px; }

  /* Materials Section Card */
  .materials-card-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 16px; }
  .materials-card-title { font-size: 16px; font-weight: 700; color: #fff; display: flex; align-items: center; gap: 8px; }
  .btn-add-material { background: linear-gradient(135deg, #2563eb, #3b82f6); color: #fff; border: none; padding: 6px 12px; border-radius: 6px; font-weight: 600; font-size: 12px; cursor: pointer; transition: all 0.2s; }
  .btn-add-material:hover { filter: brightness(1.1); }

  /* Materials Table Styles */
  .materials-table { width: 100%; border-collapse: collapse; }
  .materials-table th { text-align: left; font-size: 11px; font-weight: 600; color: #475569; padding: 8px 12px; border-bottom: 1px solid rgba(255,255,255,0.03); }
  .materials-table td { padding: 8px 6px; vertical-align: middle; }
  .table-row { border-bottom: 1px solid rgba(255, 255, 255, 0.02); transition: background-color 0.2s; }
  .table-row:hover { background-color: rgba(255, 255, 255, 0.01); }
  .table-input-name { background: transparent; border: none; color: #fff; font-size: 13.5px; font-weight: 500; outline: none; padding: 6px; width: 100%; }
  .table-input-name:focus { background: rgba(255,255,255,0.02); border-radius: 4px; }
  .table-input-cost { background: transparent; border: none; color: #fff; font-size: 13.5px; font-weight: 500; outline: none; padding: 6px; width: 55px; text-align: center; }
  .table-input-cost:focus { background: rgba(255,255,255,0.02); border-radius: 4px; }
  .table-select-unit { background: rgba(0, 0, 0, 0.2); border: 1px solid rgba(255,255,255,0.05); color: #94a3b8; border-radius: 6px; padding: 6px 8px; font-size: 12px; outline: none; cursor: pointer; max-width: 170px; }
  .table-select-unit:focus { border-color: #6366f1; }
  .table-price-thb { color: #10b981; font-weight: 600; font-size: 13.5px; text-align: right; padding-right: 8px; }
  .btn-delete-row { background: transparent; color: #ef4444; border: none; cursor: pointer; opacity: 0.6; font-size: 14px; transition: opacity 0.2s; }
  .btn-delete-row:hover { opacity: 1; }

  /* Recipes Styling */
  .recipes-container { display: flex; flex-direction: column; gap: 20px; }
  .category-section { display: flex; flex-direction: column; gap: 12px; }
  .category-header { font-size: 15px; font-weight: 700; color: #a855f7; display: flex; align-items: center; gap: 8px; margin-top: 4px; }
  .recipe-card { position: relative; background: rgba(17, 24, 39, 0.45); border: 1px solid rgba(255, 255, 255, 0.04); border-radius: 12px; padding: 18px 20px; display: flex; flex-direction: column; gap: 14px; overflow: hidden; box-shadow: 0 4px 20px rgba(0,0,0,0.15); }
  .recipe-card-header { display: flex; justify-content: space-between; align-items: center; z-index: 2; }
  .recipe-title-group { display: flex; align-items: center; gap: 8px; }
  .recipe-name { font-size: 15px; font-weight: 600; color: #fff; }
  .recipe-chance-badge { background: rgba(168, 85, 247, 0.15); color: #c084fc; font-size: 11px; font-weight: 600; padding: 2px 8px; border-radius: 20px; }
  .recipe-total-price { color: #10b981; font-size: 18px; font-weight: 700; display: flex; align-items: center; gap: 4px; }
  .recipe-ingredients-wrap { display: flex; flex-wrap: wrap; gap: 6px; z-index: 2; }
  .ingredient-badge { background: rgba(30, 41, 59, 0.6); border: 1px solid rgba(255, 255, 255, 0.05); border-radius: 6px; padding: 4px 8px; font-size: 12px; color: #94a3b8; display: inline-flex; align-items: center; gap: 6px; }

  /* Edit Mode Layouts inside Recipe Cards */
  .recipe-edit-layout { display: flex; flex-direction: column; gap: 10px; z-index: 2; }
  .recipe-edit-header { display: flex; gap: 10px; }
  .recipe-edit-ingredient-row { display: flex; gap: 8px; align-items: center; }
  .btn-add-ingredient { background: rgba(99, 102, 241, 0.1); border: 1px dashed rgba(99, 102, 241, 0.3); color: #a5b4fc; padding: 6px 12px; border-radius: 6px; font-size: 11px; font-weight: 600; cursor: pointer; align-self: flex-start; transition: all 0.2s; }
  .btn-add-ingredient:hover { background: rgba(99, 102, 241, 0.2); color: #fff; }
  .btn-add-recipe-dashed { width: 100%; border: 1px dashed rgba(255, 255, 255, 0.08); background: transparent; color: #64748b; padding: 12px; border-radius: 12px; font-weight: 500; cursor: pointer; transition: all 0.2s; }
  .btn-add-recipe-dashed:hover { border-color: rgba(99, 102, 241, 0.3); color: #a5b4fc; background: rgba(99, 102, 241, 0.02); }
  .btn-add-cat-dashed { background: transparent; border: 1px dashed rgba(255, 255, 255, 0.08); border-radius: 12px; padding: 16px; text-align: center; color: #64748b; font-size: 14px; cursor: pointer; transition: all 0.2s; }
  .btn-add-cat-dashed:hover { border-color: rgba(99, 102, 241, 0.3); color: #a5b4fc; background: rgba(99, 102, 241, 0.02); }

  /* Automation Switch Banner */
  .automation-banner { background: rgba(15, 23, 42, 0.4); border: 1px solid rgba(255, 255, 255, 0.04); border-radius: 12px; padding: 16px 24px; display: flex; justify-content: space-between; align-items: center; width: 100%; }
  .automation-info-section { display: flex; align-items: center; gap: 16px; }
  .automation-info-icon { background: rgba(99, 102, 241, 0.1); color: #6366f1; width: 36px; height: 36px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 18px; }
  .automation-text-group { display: flex; flex-direction: column; gap: 4px; }
  .automation-title { font-size: 14.5px; font-weight: 600; color: #fff; }
  .automation-desc { font-size: 12.5px; color: #64748b; }

  /* Toggle Switch Styles */
  .switch-container { position: relative; display: inline-block; width: 48px; height: 24px; cursor: pointer; }
  .switch-input { opacity: 0; width: 0; height: 0; }
  .switch-slider { position: absolute; top: 0; left: 0; right: 0; bottom: 0; background-color: #334155; transition: .3s; border-radius: 24px; }
  .switch-slider:before { position: absolute; content: ""; height: 18px; width: 18px; left: 3px; bottom: 3px; background-color: white; transition: .3s; border-radius: 50%; box-shadow: 0 2px 4px rgba(0,0,0,0.2); }
  .switch-input:checked + .switch-slider { background-color: #10b981; }
  .switch-input:checked + .switch-slider:before { transform: translateX(24px); }

  /* OCR Scanner Modal Styles */
  .ocr-modal-overlay { position: fixed; top: 0; left: 0; width: 100vw; height: 100vh; background: rgba(2, 6, 23, 0.75); display: flex; align-items: center; justify-content: center; z-index: 9999; backdrop-filter: blur(8px); }
  .ocr-modal-content { width: 90%; max-width: 650px; display: flex; flex-direction: column; gap: 20px; max-height: 85vh; overflow-y: auto; box-shadow: 0 10px 40px rgba(99, 102, 241, 0.15); border: 1px solid rgba(99, 102, 241, 0.2); }
  .ocr-progress-bar { width: 100%; height: 8px; background: #1e293b; border-radius: 4px; overflow: hidden; margin-top: 8px; }
  .ocr-progress-fill { height: 100%; background: linear-gradient(90deg, #6366f1, #3b82f6); transition: width 0.2s ease; }
  .ocr-table { width: 100%; border-collapse: collapse; margin-top: 10px; }
  .ocr-table th { text-align: left; font-size: 11px; font-weight: 600; color: #475569; padding: 8px 12px; border-bottom: 1px solid rgba(255,255,255,0.03); }
  .ocr-table td { padding: 6px 4px; vertical-align: middle; }
  .ocr-preview-row { border-bottom: 1px solid rgba(255, 255, 255, 0.02); }
  .ocr-actions-row { display: flex; justify-content: flex-end; gap: 12px; margin-top: 12px; }
  .btn-secondary { background: rgba(255, 255, 255, 0.05); color: #fff; border: 1px solid rgba(255, 255, 255, 0.1); padding: 8px 16px; border-radius: 8px; font-weight: 600; cursor: pointer; transition: all 0.2s; }
  .btn-secondary:hover { background: rgba(255, 255, 255, 0.1); }

  /* Custom Modal Styling with Auto-Scaling */
  @keyframes modalFadeIn {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  @keyframes modalScaleUp {
    from { transform: scale(0.9) translateY(20px); opacity: 0; }
    to { transform: scale(1) translateY(0); opacity: 1; }
  }
  .custom-modal-overlay {
    position: fixed;
    top: 0;
    left: 0;
    width: 100vw;
    height: 100vh;
    background: rgba(2, 6, 23, 0.7);
    backdrop-filter: blur(8px);
    -webkit-backdrop-filter: blur(8px);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 10000;
    animation: modalFadeIn 0.2s ease-out forwards;
  }
  .custom-modal-content {
    background: rgba(9, 13, 22, 0.95);
    border: 1px solid rgba(99, 102, 241, 0.2);
    box-shadow: 0 20px 50px rgba(0, 0, 0, 0.5), 0 0 40px rgba(99, 102, 241, 0.1);
    border-radius: 16px;
    padding: 24px;
    width: 90%;
    max-width: 450px;
    display: flex;
    flex-direction: column;
    gap: 20px;
    animation: modalScaleUp 0.25s cubic-bezier(0.34, 1.56, 0.64, 1) forwards;
    max-height: 90vh;
    overflow-y: auto;
    color: #e2e8f0;
  }
  .custom-modal-header {
    display: flex;
    align-items: center;
    gap: 12px;
    border-bottom: 1px solid rgba(255, 255, 255, 0.05);
    padding-bottom: 12px;
  }
  .custom-modal-title {
    font-size: 18px;
    font-weight: 700;
    color: #fff;
  }
  .custom-modal-body {
    font-size: 14.5px;
    color: #94a3b8;
    line-height: 1.6;
  }
  .custom-modal-footer {
    display: flex;
    justify-content: flex-end;
    gap: 12px;
    margin-top: 8px;
  }
  .btn-modal-primary {
    background: linear-gradient(135deg, #6366f1, #3b82f6);
    color: white;
    padding: 8px 18px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 13.5px;
    cursor: pointer;
    border: none;
    transition: all 0.2s ease;
    box-shadow: 0 4px 12px rgba(99, 102, 241, 0.2);
  }
  .btn-modal-primary:hover {
    filter: brightness(1.1);
    box-shadow: 0 6px 16px rgba(99, 102, 241, 0.3);
  }
  .btn-modal-danger {
    background: linear-gradient(135deg, #ef4444, #dc2626);
    color: white;
    padding: 8px 18px;
    border-radius: 8px;
    font-weight: 600;
    font-size: 13.5px;
    cursor: pointer;
    border: none;
    transition: all 0.2s ease;
    box-shadow: 0 4px 12px rgba(239, 68, 68, 0.2);
  }
  .btn-modal-danger:hover {
    filter: brightness(1.1);
    box-shadow: 0 6px 16px rgba(239, 68, 68, 0.3);
  }
`

const defaultData = [
  {
    id: 1,
    name: 'Freedom Community',
    igRate: 200,
    bmToCash: 10,
    materials: [
      { id: 'm1', name: 'ปูน 1 ถุง', cost: 5, unit: 'k_ig' },
      { id: 'm2', name: 'ไข่มุกทะเล', cost: 6, unit: 'k_ig' },
      { id: 'm3', name: 'Event Token', cost: 50, unit: 'k_ig' },
      { id: 'm4', name: 'Weapon Box', cost: 35, unit: 'k_ig' },
      { id: 'm5', name: 'ผลึกทะเล', cost: 32, unit: 'thb' },
      { id: 'm6', name: 'Shark Token (1ชิ้น)', cost: 0.01, unit: 'thb' },
      { id: 'm_cash', name: 'เงิน Cash', cost: 1, unit: 'cash' },
      { id: 'm_bm', name: 'Black Money', cost: 1, unit: 'bm' }
    ],
    recipes: [
      {
        id: 'r1',
        name: 'Blueprint (วิธี I)',
        category: 'Pool Cue',
        chance: 50,
        ingredients: [
          { matId: 'm1', qty: 2 },
          { matId: 'm3', qty: 1 },
          { matId: 'm_cash', qty: 250000 }
        ]
      },
      {
        id: 'rk1',
        name: 'สร้าง Knife',
        category: 'Knife',
        chance: 100,
        ingredients: [
          { matId: 'm5', qty: 1 },
          { matId: 'm4', qty: 5 },
          { matId: 'm6', qty: 200 },
          { matId: 'm3', qty: 2 },
          { matId: 'm_cash', qty: 50000 }
        ]
      }
    ]
  }
]

const SVGGem = () => (
  <svg
    width="24"
    height="24"
    viewBox="0 0 24 24"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{ filter: 'drop-shadow(0 0 6px rgba(56, 189, 248, 0.6))' }}
  >
    <path
      d="M12 2L3 9L12 22L21 9L12 2Z"
      fill="url(#gem-gradient)"
      stroke="#38bdf8"
      strokeWidth="1.5"
      strokeLinejoin="round"
    />
    <path
      d="M12 2L12 22M3 9H21M12 2L7 9L12 22L17 9L12 2Z"
      stroke="#38bdf8"
      strokeWidth="0.8"
      opacity="0.5"
    />
    <defs>
      <linearGradient id="gem-gradient" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#38bdf8" />
        <stop offset="100%" stopColor="#ec4899" />
      </linearGradient>
    </defs>
  </svg>
)

const SVGWave = () => (
  <svg
    width="120"
    height="35"
    viewBox="0 0 120 35"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    style={{
      position: 'absolute',
      bottom: 0,
      right: 0,
      opacity: 0.15,
      pointerEvents: 'none',
      zIndex: 1
    }}
  >
    <path
      d="M0 25C20 15 30 30 50 15C70 0 80 20 100 5C110 -2.5 115 10 120 2"
      stroke="#818cf8"
      strokeWidth="2"
      strokeLinecap="round"
    />
    <path
      d="M0 25C20 15 30 30 50 15C70 0 80 20 100 5C110 -2.5 115 10 120 2L120 35L0 35Z"
      fill="url(#wave-grad)"
    />
    <defs>
      <linearGradient id="wave-grad" x1="60" y1="0" x2="60" y2="35" gradientUnits="userSpaceOnUse">
        <stop stopColor="#818cf8" stopOpacity="0.25" />
        <stop offset="1" stopColor="#818cf8" stopOpacity="0" />
      </linearGradient>
    </defs>
  </svg>
)

const formatNumberWithCommas = (value) => {
  if (value === undefined || value === null || value === '') return ''

  // Convert to string and strip non-digit/decimal characters
  let str = value.toString().replace(/[^0-9.]/g, '')

  // Handle multiple decimal points (keep only the first one)
  const parts = str.split('.')
  if (parts.length > 2) {
    str = parts[0] + '.' + parts.slice(1).join('')
  }

  // Re-split to format the integer part
  const cleanParts = str.split('.')
  cleanParts[0] = cleanParts[0].replace(/\B(?=(\d{3})+(?!\d))/g, ',')

  // If there's a decimal point, join with it
  if (str.includes('.')) {
    return cleanParts[0] + '.' + (cleanParts[1] || '')
  }
  return cleanParts[0]
}

const formatDisplayNumber = (value, decimals = 2) => {
  if (value === undefined || value === null || isNaN(Number(value))) return '0.00'
  return Number(value).toLocaleString('en-US', {
    minimumFractionDigits: decimals,
    maximumFractionDigits: decimals
  })
}

export default function UltimateCraftingDashboard() {
  const [cities, setCities] = useState([])
  const [isLoaded, setIsLoaded] = useState(false)
  const [activeCityId, setActiveCityId] = useState(null)

  const [isRecipeEditMode, setIsRecipeEditMode] = useState(false)
  const [editingCityId, setEditingCityId] = useState(null)
  const [editCityName, setEditCityName] = useState('')
  const [showNewCatInput, setShowNewCatInput] = useState(false)
  const [newCatName, setNewCatName] = useState('')
  const [calcTHB, setCalcTHB] = useState('')
  const [calcIG, setCalcIG] = useState('')

  const [isSaving, setIsSaving] = useState(false)
  const pendingSaveRef = useRef(null)

  const [customModal, setCustomModal] = useState({
    isOpen: false,
    title: '',
    message: '',
    type: 'alert',
    onConfirm: null
  })

  const showAlert = (title, message) => {
    setCustomModal({
      isOpen: true,
      title,
      message,
      type: 'alert',
      onConfirm: null
    })
  }

  const showConfirm = (title, message, onConfirm) => {
    setCustomModal({
      isOpen: true,
      title,
      message,
      type: 'confirm',
      onConfirm
    })
  }

  const closeModal = () => {
    setCustomModal((prev) => ({ ...prev, isOpen: false }))
  }

  // 1. ดึงและฟังการอัปเดตข้อมูลแบบ Real-time จาก Supabase
  useEffect(() => {
    const fetchInitialData = async () => {
      try {
        const { data, error } = await supabase
          .from('server_configs')
          .select('data')
          .eq('id', 1)
          .single()

        if (error) throw error
        if (data && data.data) {
          setCities(data.data)
          if (!activeCityId && data.data.length > 0) {
            setActiveCityId(data.data[0].id)
          }
        } else {
          // If no row exists, insert initial template row
          await supabase.from('server_configs').insert([{ id: 1, data: defaultData }])
          setCities(defaultData)
          setActiveCityId(defaultData[0].id)
        }
        setIsLoaded(true)
      } catch (err) {
        console.error('Error loading data from Supabase:', err)
        setCities(defaultData)
        setActiveCityId(defaultData[0].id)
        setIsLoaded(true)
      }
    }

    fetchInitialData()

    // Subscribe to Postgres changes on server_configs table
    const channel = supabase
      .channel('supabase-changes')
      .on(
        'postgres_changes',
        { event: 'UPDATE', schema: 'public', table: 'server_configs', filter: 'id=eq.1' },
        (payload) => {
          // Only update if we don't have a pending local save
          if (!pendingSaveRef.current && payload.new && payload.new.data) {
            setCities(payload.new.data)
          }
        }
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [activeCityId])

  const activeCity = cities.find((c) => c.id === activeCityId) || cities[0]

  useEffect(() => {
    const timer = setTimeout(() => {
      setCalcTHB('')
      setCalcIG('')
    }, 0)
    return () => clearTimeout(timer)
  }, [activeCityId, activeCity?.igRate])

  // 2. ฟังก์ชันบันทึกข้อมูลแบบด่วนทันที (เช่น เมื่อเพิ่ม/ลบเซิฟเวอร์)
  const saveImmediately = async (newCitiesData) => {
    if (pendingSaveRef.current) {
      clearTimeout(pendingSaveRef.current)
      pendingSaveRef.current = null
    }
    setCities(newCitiesData)
    setIsSaving(true)
    try {
      const { error } = await supabase
        .from('server_configs')
        .update({ data: newCitiesData })
        .eq('id', 1)
      if (error) throw error
    } catch (err) {
      console.error('Error saving immediately to Supabase:', err)
    } finally {
      setIsSaving(false)
    }
  }

  // --- 🆕 ฟังก์ชันดึงข้อมูลเก่าจาก Local Storage ---
  const handleMigrateOldData = () => {
    const saved = localStorage.getItem('craftingProData') // ดึงข้อมูลที่เคยเซฟไว้ในเครื่อง
    if (saved) {
      const localData = JSON.parse(saved)
      showConfirm(
        'พบข้อมูลเก่าในเครื่องนี้',
        'ต้องการอัปโหลดขึ้น Cloud เพื่อทับข้อมูลปัจจุบันและแชร์กับทุกคนไหม?',
        () => {
          saveImmediately(localData)
          showAlert('สำเร็จ', '✅ ดึงข้อมูลเก่าขึ้น Cloud สำเร็จแล้ว!')
        }
      )
    } else {
      showAlert('แจ้งเตือน', '❌ ไม่พบข้อมูลเก่าที่บันทึกไว้ในเครื่องนี้')
    }
  }

  // ฟังก์ชันบันทึกข้อมูลแบบหน่วงเวลา (Autosave Debounce 1 วินาที เพื่อไม่ให้เสียโฟกัสกระพริบขณะพิมพ์)
  const updateCity = (updater) => {
    const newCities = cities.map((c) => (c.id === activeCityId ? updater(c) : c))
    setCities(newCities)

    if (pendingSaveRef.current) {
      clearTimeout(pendingSaveRef.current)
    }

    setIsSaving(true)
    pendingSaveRef.current = setTimeout(async () => {
      try {
        const { error } = await supabase
          .from('server_configs')
          .update({ data: newCities })
          .eq('id', 1)
        if (error) throw error
        setIsSaving(false)
        pendingSaveRef.current = null
      } catch (err) {
        console.error('Error autosaving to Supabase:', err)
      }
    }, 1000)
  }

  const handleAddCity = () => {
    const newCity = {
      // eslint-disable-next-line react-hooks/purity
      id: Date.now(),
      name: 'เซิร์ฟเวอร์ใหม่',
      igRate: 100,
      bmToCash: 10,
      materials: [],
      recipes: []
    }
    saveImmediately([...cities, newCity])
    setActiveCityId(newCity.id)
  }

  const handleDeleteCity = (id, e) => {
    e.stopPropagation()
    showConfirm(
      'ยืนยันการลบเซิร์ฟเวอร์',
      'คุณแน่ใจหรือไม่ว่าต้องการลบเซิร์ฟเวอร์นี้? ข้อมูลทั้งหมดจะไม่สามารถกู้คืนได้',
      () => {
        const newCities = cities.filter((c) => c.id !== id)
        saveImmediately(newCities)
        if (activeCityId === id && newCities.length > 0) setActiveCityId(newCities[0].id)
      }
    )
  }

  const saveEditCity = (id) => {
    const newCities = cities.map((c) => (c.id === id ? { ...c, name: editCityName } : c))
    saveImmediately(newCities)
    setEditingCityId(null)
  }

  const handleAddNewCategory = () => {
    if (newCatName.trim()) {
      updateCity((c) => ({
        ...c,
        recipes: [
          ...c.recipes,
          {
            id: `r_${Date.now()}`,
            name: 'สูตรใหม่',
            category: newCatName.trim(),
            chance: 100,
            ingredients: []
          }
        ]
      }))
      setNewCatName('')
      setShowNewCatInput(false)
    }
  }

  const startEditCity = (city, e) => {
    e.stopPropagation()
    setEditingCityId(city.id)
    setEditCityName(city.name)
  }

  const handleTHBChange = (val) => {
    setCalcTHB(val)
    if (!val || Number(val) <= 0) {
      setCalcIG('')
      return
    }
    const numIG = Number(val) * (1000000 / activeCity.igRate)
    setCalcIG(numIG.toFixed(0))
  }

  const handleIGChange = (val) => {
    setCalcIG(val)
    if (!val || Number(val) <= 0) {
      setCalcTHB('')
      return
    }
    const numTHB = (Number(val) / 1000000) * activeCity.igRate
    setCalcTHB(numTHB.toFixed(2))
  }

  const getUnitMultiplier = (unit) => {
    if (!activeCity) return 0
    const thbPerIg = activeCity.igRate / 1000000
    switch (unit) {
      case 'k_ig':
        return thbPerIg * 1000
      case 'ig':
        return thbPerIg
      case 'cash':
        return thbPerIg
      case 'bm':
        return thbPerIg * activeCity.bmToCash
      case 'afkc':
        return thbPerIg * 1800
      case 'thb':
        return 1
      default:
        return 0
    }
  }

  const getMaterialThb = (material) => material.cost * getUnitMultiplier(material.unit)
  const getRecipeTotal = (recipe) => {
    return recipe.ingredients.reduce((sum, ing) => {
      const mat = activeCity?.materials.find((m) => m.id === ing.matId)
      return sum + (mat ? getMaterialThb(mat) * ing.qty : 0)
    }, 0)
  }

  if (!isLoaded)
    return (
      <div
        style={{
          height: '100vh',
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          background: '#020617',
          color: '#fff'
        }}
      >
        Connecting Cloud... ☁️
      </div>
    )

  const categories = Array.from(new Set(activeCity.recipes.map((r) => r.category)))

  return (
    <>
      <style>{globalStyle}</style>
      <div className="dashboard-layout">
        {/* Sidebar */}
        <div className="sidebar">
          {/* Logo Section */}
          <div className="brand-section">
            <SVGGem />
            <div>
              <div className="brand-title">EcoCraft Pro</div>
              <div className="brand-status">
                <span
                  style={{
                    display: 'inline-block',
                    width: '6px',
                    height: '6px',
                    borderRadius: '50%',
                    background: isSaving ? '#f59e0b' : '#10b981',
                    boxShadow: isSaving ? '0 0 8px #f59e0b' : '0 0 8px #10b981',
                    transition: 'all 0.3s ease'
                  }}
                ></span>
                {isSaving ? 'Autosaving...' : 'Online Sync'}
              </div>
            </div>
          </div>

          {/* Active Servers List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '4px' }}>
            {cities.map((city) => (
              <div
                key={city.id}
                className={`sidebar-item ${activeCityId === city.id ? 'active' : ''}`}
                onClick={() => setActiveCityId(city.id)}
              >
                {editingCityId === city.id ? (
                  <div
                    style={{ display: 'flex', gap: '8px', width: '100%' }}
                    onClick={(e) => e.stopPropagation()}
                  >
                    <input
                      autoFocus
                      className="pro-input-field"
                      style={{
                        padding: '4px',
                        background: 'rgba(0,0,0,0.3)',
                        border: '1px solid #334155',
                        borderRadius: '6px',
                        height: '28px'
                      }}
                      value={editCityName}
                      onChange={(e) => setEditCityName(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && saveEditCity(city.id)}
                    />
                    <button
                      className="btn-edit-recipe btn-success"
                      style={{ padding: '4px 8px', fontSize: '11px', height: '28px' }}
                      onClick={() => saveEditCity(city.id)}
                    >
                      ✓
                    </button>
                  </div>
                ) : (
                  <>
                    <div className="sidebar-item-content">
                      <span>🏠</span>
                      <span>{city.name}</span>
                    </div>
                    <div
                      style={{ display: 'flex', gap: '2px' }}
                      onClick={(e) => e.stopPropagation()}
                    >
                      <button
                        className="btn-delete-row"
                        style={{ color: '#6366f1', padding: '2px 6px', fontSize: '12px' }}
                        onClick={(e) => startEditCity(city, e)}
                      >
                        ✎
                      </button>
                      {cities.length > 1 && (
                        <button
                          className="btn-delete-row"
                          style={{ padding: '2px 6px', fontSize: '12px' }}
                          onClick={(e) => handleDeleteCity(city.id, e)}
                        >
                          ✕
                        </button>
                      )}
                    </div>
                  </>
                )}
              </div>
            ))}
          </div>

          {/* Bottom Sidebar Action Buttons */}
          <div
            style={{
              display: 'flex',
              flexDirection: 'column',
              gap: '8px',
              marginTop: 'auto',
              paddingBottom: '8px'
            }}
          >
            <button className="btn-sidebar-primary" onClick={handleAddCity}>
              + Add Server
            </button>
            <button className="btn-sidebar-secondary" onClick={handleMigrateOldData}>
              <span>📥</span>
              ดึงข้อมูลเก่าจากเครื่อง
            </button>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="main-content">
          <div className="content-wrapper">
            {/* Header section */}
            <div className="header-section">
              <div className="header-title-container">
                <h1 className="header-title">
                  {activeCity?.name}
                  <span className="pro-badge">Pro</span>
                </h1>
                <div className="header-subtitle">
                  <span>⏱️</span>
                  จัดการเศรษฐกิจเซิร์ฟเวอร์ของคุณ
                </div>
              </div>
              <div className="header-actions">
                <button
                  className={isRecipeEditMode ? 'btn-edit-recipe btn-success' : 'btn-edit-recipe'}
                  onClick={() => setIsRecipeEditMode(!isRecipeEditMode)}
                >
                  <span>⚙️</span>
                  {isRecipeEditMode ? 'บันทึกสูตร' : 'แก้ไขสูตร'}
                </button>
              </div>
            </div>

            {/* Stats Row */}
            <div className="top-stats-grid">
              {/* Card 1: เรทเงิน */}
              <div className="stat-card">
                <div className="stat-card-title">เรทเงิน (1M IG)</div>
                <div className="input-prefix-container">
                  <span className="input-prefix-icon">฿</span>
                  <input
                    type="text"
                    className="pro-input-field"
                    value={formatNumberWithCommas(activeCity?.igRate)}
                    onChange={(e) => {
                      const cleanVal = e.target.value.replace(/,/g, '')
                      updateCity((c) => ({ ...c, igRate: cleanVal === '' ? 0 : Number(cleanVal) }))
                    }}
                  />
                </div>
                <div className="stat-card-desc">ราคากลางในเซิร์ฟเวอร์</div>
              </div>

              {/* Card 2: เรทตลาดมืด */}
              <div className="stat-card">
                <div className="stat-card-title">เรทตลาดมืด (1 BM)</div>
                <div className="input-prefix-container">
                  <span className="input-prefix-icon">$</span>
                  <input
                    type="text"
                    className="pro-input-field"
                    value={formatNumberWithCommas(activeCity?.bmToCash)}
                    onChange={(e) => {
                      const cleanVal = e.target.value.replace(/,/g, '')
                      updateCity((c) => ({
                        ...c,
                        bmToCash: cleanVal === '' ? 0 : Number(cleanVal)
                      }))
                    }}
                  />
                </div>
                <div className="stat-card-desc">ราคากลางในเซิร์ฟเวอร์</div>
              </div>

              {/* Card 3: แปลงเงิน */}
              <div className="stat-card conversion-card">
                <div className="stat-card-title conversion-card-title">แปลงเงิน</div>
                <div className="conversion-inputs-row">
                  <input
                    type="text"
                    className="conversion-input-box"
                    value={formatNumberWithCommas(calcTHB)}
                    onChange={(e) => handleTHBChange(e.target.value.replace(/,/g, ''))}
                    placeholder="บาท"
                  />
                  <span className="conversion-equals">=</span>
                  <input
                    type="text"
                    className="conversion-input-box"
                    value={formatNumberWithCommas(calcIG)}
                    onChange={(e) => handleIGChange(e.target.value.replace(/,/g, ''))}
                    placeholder="IG"
                  />
                  <button
                    className="btn-swap-calc"
                    onClick={() => {
                      setCalcTHB('')
                      setCalcIG('')
                    }}
                    title="Clear"
                  >
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2.5"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                    >
                      <path d="M17 1l4 4-4 4M21 5H9M7 23l-4-4 4-4M3 19h12" />
                    </svg>
                  </button>
                </div>
                <div className="stat-card-desc">คำนวณเงินสด ⇆ เงินในเกม</div>
              </div>
            </div>

            {/* Main Grid */}
            <div className="content-grid">
              {/* Materials Card */}
              <div className="glass-panel">
                <div className="materials-card-header">
                  <h3 className="materials-card-title">
                    <span>📦</span>
                    คลังวัตถุดิบ
                  </h3>
                  <button
                    className="btn-add-material"
                    onClick={() =>
                      updateCity((c) => ({
                        ...c,
                        materials: [
                          ...c.materials,
                          { id: `m_${Date.now()}`, name: 'ไอเทมใหม่', cost: 0, unit: 'k_ig' }
                        ]
                      }))
                    }
                  >
                    + เพิ่ม
                  </button>
                </div>

                <div style={{ overflowX: 'auto' }}>
                  <table className="materials-table">
                    <thead>
                      <tr>
                        <th>รายการ</th>
                        <th style={{ textAlign: 'center' }}>จำนวน</th>
                        <th>หน่วย</th>
                        <th style={{ textAlign: 'right' }}>ราคา (฿)</th>
                        <th style={{ textAlign: 'center' }}>ลบ</th>
                      </tr>
                    </thead>
                    <tbody>
                      {activeCity?.materials.map((mat) => (
                        <tr key={mat.id} className="table-row">
                          <td style={{ width: '38%' }}>
                            <input
                              className="table-input-name"
                              value={mat.name}
                              onChange={(e) =>
                                updateCity((c) => ({
                                  ...c,
                                  materials: c.materials.map((m) =>
                                    m.id === mat.id ? { ...m, name: e.target.value } : m
                                  )
                                }))
                              }
                            />
                          </td>
                          <td style={{ width: '15%', textAlign: 'center' }}>
                            <input
                              type="text"
                              className="table-input-cost"
                              value={formatNumberWithCommas(mat.cost)}
                              onChange={(e) => {
                                const cleanVal = e.target.value.replace(/,/g, '')
                                updateCity((c) => ({
                                  ...c,
                                  materials: c.materials.map((m) =>
                                    m.id === mat.id
                                      ? { ...m, cost: cleanVal === '' ? 0 : Number(cleanVal) }
                                      : m
                                  )
                                }))
                              }}
                            />
                          </td>
                          <td style={{ width: '28%' }}>
                            <select
                              className="table-select-unit"
                              value={mat.unit}
                              onChange={(e) =>
                                updateCity((c) => ({
                                  ...c,
                                  materials: c.materials.map((m) =>
                                    m.id === mat.id ? { ...m, unit: e.target.value } : m
                                  )
                                }))
                              }
                            >
                              <option value="k_ig">🎮 1k IG (1,000 ในเกม)</option>
                              <option value="ig">🕹️ IG (ในเกม)</option>
                              <option value="cash">💵 Cash (เงินเขียว)</option>
                              <option value="bm">🔴 BM (เงินแดง)</option>
                              <option value="thb">🪙 บาท (฿)</option>
                            </select>
                          </td>
                          <td style={{ width: '14%' }} className="table-price-thb">
                            {formatDisplayNumber(getMaterialThb(mat), 2)}
                          </td>
                          <td style={{ width: '5%', textAlign: 'center' }}>
                            <button
                              className="btn-delete-row"
                              onClick={() =>
                                updateCity((c) => ({
                                  ...c,
                                  materials: c.materials.filter((m) => m.id !== mat.id)
                                }))
                              }
                            >
                              🗑
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

              {/* Recipes Container */}
              <div className="recipes-container">
                {categories.map((cat) => (
                  <div key={cat} className="category-section">
                    <div className="category-header">
                      <span>🛠️</span>
                      {cat}
                    </div>

                    {activeCity?.recipes
                      .filter((r) => r.category === cat)
                      .map((recipe) => (
                        <div key={recipe.id} className="recipe-card">
                          <SVGWave />
                          {!isRecipeEditMode ? (
                            <>
                              <div className="recipe-card-header">
                                <div className="recipe-title-group">
                                  <span className="recipe-name">{recipe.name}</span>
                                  <span className="recipe-chance-badge">
                                    {formatNumberWithCommas(recipe.chance)}%
                                  </span>
                                </div>
                                <div className="recipe-total-price">
                                  {formatDisplayNumber(getRecipeTotal(recipe), 2)}{' '}
                                  <span style={{ fontSize: '14px', marginLeft: '4px' }}>฿</span>
                                </div>
                              </div>
                              <div className="recipe-ingredients-wrap">
                                {recipe.ingredients.map((ing, idx) => {
                                  const mat = activeCity.materials.find((m) => m.id === ing.matId)
                                  return (
                                    <span key={idx} className="ingredient-badge">
                                      {mat?.name} x{formatNumberWithCommas(ing.qty)}
                                    </span>
                                  )
                                })}
                              </div>
                            </>
                          ) : (
                            <div className="recipe-edit-layout">
                              <div className="recipe-edit-header">
                                <input
                                  className="pro-input-field"
                                  style={{
                                    background: 'rgba(0,0,0,0.3)',
                                    border: '1px solid #1e293b',
                                    borderRadius: '8px',
                                    height: '36px'
                                  }}
                                  value={recipe.name}
                                  onChange={(e) =>
                                    updateCity((c) => ({
                                      ...c,
                                      recipes: c.recipes.map((r) =>
                                        r.id === recipe.id ? { ...r, name: e.target.value } : r
                                      )
                                    }))
                                  }
                                />
                                <input
                                  type="text"
                                  className="pro-input-field"
                                  style={{
                                    width: '80px',
                                    background: 'rgba(0,0,0,0.3)',
                                    border: '1px solid #1e293b',
                                    borderRadius: '8px',
                                    height: '36px',
                                    textAlign: 'center'
                                  }}
                                  value={formatNumberWithCommas(recipe.chance)}
                                  onChange={(e) => {
                                    const cleanVal = e.target.value.replace(/,/g, '')
                                    updateCity((c) => ({
                                      ...c,
                                      recipes: c.recipes.map((r) =>
                                        r.id === recipe.id
                                          ? { ...r, chance: cleanVal === '' ? 0 : Number(cleanVal) }
                                          : r
                                      )
                                    }))
                                  }}
                                  placeholder="%"
                                />
                                <button
                                  className="btn-delete-row"
                                  style={{
                                    background: 'rgba(239, 68, 68, 0.1)',
                                    padding: '0 12px',
                                    borderRadius: '8px'
                                  }}
                                  onClick={() =>
                                    updateCity((c) => ({
                                      ...c,
                                      recipes: c.recipes.filter((r) => r.id !== recipe.id)
                                    }))
                                  }
                                >
                                  ลบ
                                </button>
                              </div>
                              {recipe.ingredients.map((ing, idx) => (
                                <div key={idx} className="recipe-edit-ingredient-row">
                                  <select
                                    className="table-select-unit"
                                    style={{ flex: 1 }}
                                    value={ing.matId}
                                    onChange={(e) =>
                                      updateCity((c) => ({
                                        ...c,
                                        recipes: c.recipes.map((r) =>
                                          r.id === recipe.id
                                            ? {
                                                ...r,
                                                ingredients: r.ingredients.map((i, iIdx) =>
                                                  iIdx === idx ? { ...i, matId: e.target.value } : i
                                                )
                                              }
                                            : r
                                        )
                                      }))
                                    }
                                  >
                                    {activeCity.materials.map((m) => (
                                      <option key={m.id} value={m.id}>
                                        {m.name}
                                      </option>
                                    ))}
                                  </select>
                                  <input
                                    type="text"
                                    className="pro-input-field"
                                    style={{
                                      width: '80px',
                                      background: 'rgba(0,0,0,0.3)',
                                      border: '1px solid #1e293b',
                                      borderRadius: '8px',
                                      height: '32px',
                                      textAlign: 'center'
                                    }}
                                    value={formatNumberWithCommas(ing.qty)}
                                    onChange={(e) =>
                                      updateCity((c) => ({
                                        ...c,
                                        recipes: c.recipes.map((r) =>
                                          r.id === recipe.id
                                            ? {
                                                ...r,
                                                ingredients: r.ingredients.map((i, iIdx) =>
                                                  iIdx === idx
                                                    ? {
                                                        ...i,
                                                        qty:
                                                          e.target.value === ''
                                                            ? 0
                                                            : Number(
                                                                e.target.value.replace(/,/g, '')
                                                              )
                                                      }
                                                    : i
                                                )
                                              }
                                            : r
                                        )
                                      }))
                                    }
                                  />
                                  <button
                                    className="btn-delete-row"
                                    onClick={() =>
                                      updateCity((c) => ({
                                        ...c,
                                        recipes: c.recipes.map((r) =>
                                          r.id === recipe.id
                                            ? {
                                                ...r,
                                                ingredients: r.ingredients.filter(
                                                  (i, iIdx) => iIdx !== idx
                                                )
                                              }
                                            : r
                                        )
                                      }))
                                    }
                                  >
                                    🗑
                                  </button>
                                </div>
                              ))}
                              <button
                                className="btn-add-ingredient"
                                onClick={() =>
                                  updateCity((c) => ({
                                    ...c,
                                    recipes: c.recipes.map((r) =>
                                      r.id === recipe.id
                                        ? {
                                            ...r,
                                            ingredients: [
                                              ...r.ingredients,
                                              { matId: activeCity.materials[0].id, qty: 1 }
                                            ]
                                          }
                                        : r
                                    )
                                  }))
                                }
                              >
                                + เพิ่มส่วนผสม
                              </button>
                            </div>
                          )}
                        </div>
                      ))}
                    {isRecipeEditMode && (
                      <button
                        className="btn-add-recipe-dashed"
                        onClick={() =>
                          updateCity((c) => ({
                            ...c,
                            recipes: [
                              ...c.recipes,
                              {
                                id: `r_${Date.now()}`,
                                name: 'สูตรใหม่',
                                category: cat,
                                chance: 100,
                                ingredients: []
                              }
                            ]
                          }))
                        }
                      >
                        + เพิ่มสูตร
                      </button>
                    )}
                  </div>
                ))}

                {isRecipeEditMode && (
                  <div className="btn-add-cat-dashed">
                    {!showNewCatInput ? (
                      <div onClick={() => setShowNewCatInput(true)}>+ สร้างหมวดหมู่ใหม่</div>
                    ) : (
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <input
                          autoFocus
                          className="pro-input-field"
                          style={{
                            background: 'rgba(0,0,0,0.3)',
                            border: '1px solid #334155',
                            borderRadius: '8px',
                            height: '36px'
                          }}
                          placeholder="ชื่อหมวดหมู่..."
                          value={newCatName}
                          onChange={(e) => setNewCatName(e.target.value)}
                          onKeyDown={(e) => e.key === 'Enter' && handleAddNewCategory()}
                        />
                        <button
                          className="btn-edit-recipe btn-success"
                          style={{ height: '36px' }}
                          onClick={handleAddNewCategory}
                        >
                          OK
                        </button>
                      </div>
                    )}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>

      {customModal.isOpen && (
        <div className="custom-modal-overlay" onClick={closeModal}>
          <div className="custom-modal-content" onClick={(e) => e.stopPropagation()}>
            <div className="custom-modal-header">
              <span style={{ fontSize: '20px' }}>
                {customModal.type === 'confirm' ? '❓' : '🔔'}
              </span>
              <h4 className="custom-modal-title" style={{ margin: 0 }}>
                {customModal.title}
              </h4>
            </div>
            <div className="custom-modal-body">{customModal.message}</div>
            <div className="custom-modal-footer">
              {customModal.type === 'confirm' ? (
                <>
                  <button
                    className="btn-secondary"
                    style={{ padding: '8px 16px', fontSize: '13px' }}
                    onClick={closeModal}
                  >
                    ยกเลิก
                  </button>
                  <button
                    className={
                      customModal.title.includes('ลบ') ? 'btn-modal-danger' : 'btn-modal-primary'
                    }
                    onClick={() => {
                      if (customModal.onConfirm) customModal.onConfirm()
                      closeModal()
                    }}
                  >
                    ยืนยัน
                  </button>
                </>
              ) : (
                <button className="btn-modal-primary" onClick={closeModal}>
                  ตกลง
                </button>
              )}
            </div>
          </div>
        </div>
      )}
    </>
  )
}
