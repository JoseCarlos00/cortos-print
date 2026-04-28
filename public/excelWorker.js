console.log('[Worker] iniciado');
importScripts('https://cdnjs.cloudflare.com/ajax/libs/xlsx/0.18.5/xlsx.full.min.js');

self.onmessage = function (e) {
  console.log('[Worker] mensaje recibido');

  const { fileData } = e.data;

  try {
    const wb = XLSX.read(fileData);
    const ws = wb.Sheets[wb.SheetNames[0]];

    const html = XLSX.utils.sheet_to_html(ws);

    console.log('[Worker] procesado OK');

    self.postMessage({ success: true, html });
  } catch (error) {
    console.error('[Worker] error:', error);
    self.postMessage({ success: false, error: error.message });
  }
};
