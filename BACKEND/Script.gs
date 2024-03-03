const arquivoExcel = SpreadsheetApp.openByUrl(`https://docs.google.com/spreadsheets/d/${process.env.REACT_APP_GOOGLE_SHEET_ID}/`);

const doDelete = (request = {}) => {
  const calculo = request.parameter.calculo;
  
  if (!calculo || calculo === "") {
    let output = ContentService.createTextOutput(JSON.stringify({ result: "error", message: "Forneça um cálculo" }));
    output.setMimeType(ContentService.MimeType.JSON);
    // output.append('Access-Control-Allow-Origin', '*');
    return output;
  }

  let planilha = arquivoExcel.getSheetByName(calculo.toUpperCase());

  if (!planilha) {
    let output = ContentService.createTextOutput(JSON.stringify({ result: "error", message: "Forneça um cálculo existente" }));
    output.setMimeType(ContentService.MimeType.JSON);
    // output.append('Access-Control-Allow-Origin', '*');
    return output;
  }

  arquivoExcel.deleteSheet(planilha); 

  let output = ContentService.createTextOutput(JSON.stringify({ result: "success", message: "Sucesso na deleção do cálculo!" }));
  output.setMimeType(ContentService.MimeType.JSON);
  // output.append('Access-Control-Allow-Origin', '*');
  return output;
}

const doPost = (request = {}) => {
  const calculo = request.parameter.calculo;
  const action = request.parameter.action;

  if (action === "delete") {
    return doDelete(request);
  }
  
  if (!calculo || calculo === "" || !request.postData) {
    let output = ContentService.createTextOutput(JSON.stringify({ result: "error", message: "Forneça um cálculo" }));
    output.setMimeType(ContentService.MimeType.JSON);
    // output.append('Access-Control-Allow-Origin', '*');
    return output;
  }
  
  const body = request.postData.contents;
  const calculoJson = JSON.parse(body);

  let planilha = arquivoExcel.getSheetByName(calculo.toUpperCase());
  if (!planilha) {
    planilha = arquivoExcel.insertSheet(calculo.toUpperCase());
  }
  planilha.getRange(1, 1).setValue(JSON.stringify(calculoJson));

  let output = ContentService.createTextOutput(JSON.stringify({ result: "success", message: "Sucesso na inserção do cálculo!" }));
  output.setMimeType(ContentService.MimeType.JSON);
  // output.append('Access-Control-Allow-Origin', '*');
  return output;
};

const doGet = () => {
  const planilhas = arquivoExcel.getSheets();
  const calculos = [];

  for (const planilha of planilhas) {
    const nomeCalculo = planilha.getName();
    const calculoJson = JSON.parse(planilha.getRange(1, 1).getValue());

    const calculo = {
      nome: nomeCalculo,
      calculo: calculoJson
    };

    calculos.push(calculo);
  }

  let output = ContentService.createTextOutput(JSON.stringify(calculos));
  output.setMimeType(ContentService.MimeType.JSON);
  // output.append('Access-Control-Allow-Origin', '*');
  return output;
};


