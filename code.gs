function doGet() {
  return HtmlService.createHtmlOutputFromFile('Index')
    .setTitle('Dashboard Rotas V2')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL)
    .addMetaTag('viewport', 'width=device-width, initial-scale=1');
}

function getHubNames() {
  // Pega todas as abas, MAS remove a aba "Dash" da lista
  return SpreadsheetApp.getActiveSpreadsheet().getSheets()
    .map(s => s.getName())
    .filter(name => name !== 'Dash'); // <--- FILTRO AQUI
}

function fetchDadosHub(hubName) {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheet = ss.getSheetByName(hubName);
  if (!sheet) return null;

  const rawData = sheet.getDataRange().getDisplayValues();
  
  return {
    headers: rawData[0],
    rows: rawData.slice(1)
  };
}

// --- FUNÇÃO CONSOLIDADA (Com filtro da aba Dash) ---
function fetchDadosConsolidados() {
  const ss = SpreadsheetApp.getActiveSpreadsheet();
  const sheets = ss.getSheets();
  
  let headers = [];
  let allRows = [];

  for (let i = 0; i < sheets.length; i++) {
    const sheet = sheets[i];
    const sheetName = sheet.getName();

    // --- REGRA DE EXCLUSÃO ---
    // Se o nome for "Dash", ignora e vai para a próxima aba
    if (sheetName === 'Dash') continue; 
    
    // Opcional: Ignorar abas ocultas também
    // if (sheet.isSheetHidden()) continue;

    const data = sheet.getDataRange().getDisplayValues();
    
    if (data.length > 0) {
      // Define o cabeçalho usando a primeira aba válida encontrada
      if (headers.length === 0) {
        headers = data[0]; 
      }
      
      // Adiciona apenas os dados (pulando a linha 0 que é cabeçalho)
      const rows = data.slice(1);
      allRows = allRows.concat(rows);
    }
  }

  return {
    headers: headers,
    rows: allRows
  };
}

// Funções de UI para o botão (se ainda estiver usando)
function onOpen() {
  SpreadsheetApp.getUi()
    .createMenu('🚀 Sistema de Rotas')
    .addItem('Abrir Dashboard', 'abrirDashboard')
    .addToUi();
}

function abrirDashboard() {
  const html = HtmlService.createHtmlOutputFromFile('Index')
    .setWidth(1280)
    .setHeight(800)
    .setTitle('Dashboard de Rotas V2');
  SpreadsheetApp.getUi().showModalDialog(html, ' ');
}
