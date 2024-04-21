
export const isCalculoValid = (calculo, ultimaDataIndice) => {
    for (let item of calculo.calculos) {
        if (item.valor === "" || Number(item.valor.replace(/[^0-9]/g, '')) === 0) {
            return false;
        }

        if ((item.dataInicial.length !== 7 || !/^\d{2}\/\d{4}$/.test(item.dataInicial))
            || (item.dataFinal.length !== 7 || !/^\d{2}\/\d{4}$/.test(item.dataFinal))) {
                return false;
        }

        if ((Number(item.juros.replace(",", ".")) !== 0) &&
            ((item.dataInicialJuros.length !== 10 || !/^\d{2}\/\d{2}\/\d{4}$/.test(item.dataInicialJuros))
            || (item.dataFinalJuros.length !== 10 || !/^\d{2}\/\d{2}\/\d{4}$/.test(item.dataFinalJuros)))) {
                return false;
        }

        if (item.dataInicial.length === 7 && /^\d{2}\/\d{4}$/.test(item.dataInicial)) {
            const [month, year] = item.dataInicial.split('/');
            const day = "01";
            const date = new Date(`${month}/${day}/${year}`);
            
            if (date.toString() === "Invalid Date" || date > new Date() || date < new Date("01/01/1994")) {
                return false;
            }
        }

        if (item.dataFinal.length === 7 && /^\d{2}\/\d{4}$/.test(item.dataFinal)) {
            const [month, year] = item.dataFinal.split('/');
            const day = "01";
            const date = new Date(`${month}/${day}/${year}`);
            
            if (date.toString() === "Invalid Date" || date > new Date() || date < new Date("01/01/1994") || date > ultimaDataIndice) {
                return false;
            }
        }

        if ((Number(item.juros.replace(",", ".")) !== 0) &&
            (item.dataInicialJuros.length === 10 && /^\d{2}\/\d{2}\/\d{4}$/.test(item.dataInicialJuros))) {
            const [day, month, year] = item.dataInicialJuros.split('/');
            const date = new Date(`${month}/${day}/${year}`);

            if (date.toString() === "Invalid Date" || date > new Date() || date < new Date("01/01/1994")) {
                return false;
            }
        }

        if ((Number(item.juros.replace(",", ".")) !== 0) &&
            (item.dataFinalJuros.length === 10 && /^\d{2}\/\d{2}\/\d{4}$/.test(item.dataFinalJuros))) {
            const [day, month, year] = item.dataFinalJuros.split('/');
            const date = new Date(`${month}/${day}/${year}`);

            if (date.toString() === "Invalid Date" || date > new Date() || date < new Date("01/01/1994")) {
                return false;
            }
        }

        const dia = "01";
        const [mesInicial, anoInicial] = item.dataInicial.split('/');
        const dataInicialDate = new Date(`${mesInicial}/${dia}/${anoInicial}`);

        const [mesFinal, anoFinal] = item.dataFinal.split('/');
        const dataFinalDate = new Date(`${mesFinal}/${dia}/${anoFinal}`);

        if ((dataInicialDate.toString() === "Invalid Date" || dataFinalDate.toString() === "Invalid Date")
            || (anoInicial.length !== 4 || anoFinal.length !== 4)
            || (dataInicialDate > new Date() || dataInicialDate < new Date("01/01/1994") || dataInicialDate > ultimaDataIndice)
            || (dataFinalDate > new Date() || dataFinalDate < new Date("01/01/1994") || dataFinalDate > ultimaDataIndice)
            || (dataInicialDate > dataFinalDate)
        ) {
            return false;
        }

        const [diaInicialJuros, mesInicialJuros, anoInicialJuros] = item.dataInicialJuros.split('/');
        const dataInicialJurosDate = new Date(`${mesInicialJuros}/${diaInicialJuros}/${anoInicialJuros}`);

        const [diaFinalJuros, mesFinalJuros, anoFinalJuros] = item.dataFinalJuros.split('/');
        const dataFinalJurosDate = new Date(`${mesFinalJuros}/${diaFinalJuros}/${anoFinalJuros}`);

        if ((Number(item.juros.replace(",", ".")) !== 0)
            && (
                (dataInicialJurosDate.toString() === "Invalid Date" || dataFinalJurosDate.toString() === "Invalid Date")
                || (anoInicialJuros.length !== 4 || anoFinalJuros.length !== 4)
                || (dataInicialJurosDate > new Date() || dataInicialJurosDate < new Date("01/01/1994"))
                || (dataFinalJurosDate > new Date() || dataFinalJurosDate < new Date("01/01/1994"))
                || (dataInicialJurosDate >= dataFinalJurosDate)
            )
        ) {
            return false;
        }

        const diaFinalCalculo = "01";

        const [mesFinalCalculo, anoFinalCalculo] = item.dataFinalCalculo.split('/');
        const dataFinalCalculoDate = new Date(`${mesFinalCalculo}/${diaFinalCalculo}/${anoFinalCalculo}`);

        if ((!item.isCalculoUnico) 
            && ((dataFinalCalculoDate.toString() === "Invalid Date")
            || (anoFinalCalculo.length !== 4)
            || (dataFinalCalculoDate > new Date() || dataFinalCalculoDate < new Date("01/01/1994") || dataFinalCalculoDate > ultimaDataIndice)
            || (dataFinalCalculoDate > dataFinalDate)
            || (dataFinalCalculoDate < dataInicialDate))
        ) {
            return false;
        }
    }
    
    return true;
}


const correcaoMonetariaINPC = (variacoesINPC, montante, startDate, endDate) => {
    let currentDate = new Date(startDate);
    let currentYear = currentDate.getFullYear();
    let currentMonth = validMonths[currentDate.getMonth()];

    while (currentDate <= endDate) {
        // eslint-disable-next-line
        const matchingVariacao = variacoesINPC.find((item) => item.mes === currentMonth && item.ano === currentYear);

        if (matchingVariacao) {
            montante = montante * (1 + matchingVariacao.variacao / 100);
        }

        currentDate.setMonth(currentDate.getMonth() + 1);
        currentYear = currentDate.getFullYear();
        currentMonth = validMonths[currentDate.getMonth()];
    }

    return montante;
}

const calcularJuros = (montante, juros, startDateJuros, endDateJuros, monthsDifference) => {
    if (!juros || juros === 0 || startDateJuros > endDateJuros) {
        return 0;
    }

    const oneDay = 24 * 60 * 60 * 1000;
    const dataInicioJuros = startDateJuros.getTime();
    const dataFimJuros = endDateJuros.getTime();
    const timeDifference = dataFimJuros - dataInicioJuros;
    const daysDifference = timeDifference / oneDay;
    monthsDifference.difference = (daysDifference / 365) * 12;

    return (montante * ((monthsDifference.difference * juros) / 100));
}

const calcularMulta = (valorCorrigido, multa) => {
    if (multa === 0) {
        return 0;
    }
    
    return (valorCorrigido * (multa / 100));
}

const calcularHonorarios = (valorComMulta, honorarios) => {
    if (honorarios === 0) {
        return 0;
    }

    return (valorComMulta * (honorarios / 100));
}

const validMonths = ["JAN", "FEV", "MAR", "ABR", "MAI", "JUN", "JUL", "AGO", "SET", "OUT", "NOV", "DEZ"];
const mesesExtenso = ["janeiro", "fevereiro", "março", "abril", "maio", "junho", "julho", "agosto", "setembro", "outubro", "novembro", "dezembro"];

// const truncateToDecimals = (num, dec = 2) => {
//     const calcDec = Math.pow(10, dec);
//     return Math.trunc(num * calcDec) / calcDec;
// }

const calcular = (variacoesINPC, calculo, startDate, endDate, startDateJuros, endDateJuros) => {

    let montanteInicial = Number(calculo.valor.replace("R$ ", "").replace(",", "."));
    let montanteCorrigido = correcaoMonetariaINPC(variacoesINPC, montanteInicial, startDate, endDate)

    const monthsDifference = { difference: 0 };

    let juros = Number(calculo.juros.replace(",", "."));
    let valorJurosMensais = calcularJuros(montanteCorrigido, juros, startDateJuros, endDateJuros, monthsDifference);
    let montanteCorrigidoComJuros = (montanteCorrigido + valorJurosMensais);

    if (juros === 0) {
        startDateJuros = "";
        endDateJuros = "";
    }

    let multa = Number(calculo.multa.replace(",", "."));
    let valorMultaCalculada = calcularMulta(montanteCorrigidoComJuros, multa);
    let montanteCorrigidoComJurosEMulta = montanteCorrigidoComJuros + valorMultaCalculada;

    let honorarios = Number(calculo.honorarios.replace(",", "."));
    let valorHonorarios = calcularHonorarios(montanteCorrigidoComJurosEMulta, honorarios);
    let montanteCorrigidoComJurosEMultaEHonorarios = montanteCorrigidoComJurosEMulta + valorHonorarios;

    let valorTotal = montanteCorrigidoComJurosEMultaEHonorarios;

    return { 
        dataInicial: `${(startDate.getMonth() + 1).toString().padStart(2, '0')}/${startDate.getFullYear()}`,
        dataFinal: `${(endDate.getMonth() + 1).toString().padStart(2, '0')}/${endDate.getFullYear()}`,
        descricao: `Correção ${mesesExtenso[startDate.getMonth()]} de ${startDate.getFullYear()}`,
        montanteInicial: montanteInicial.toFixed(2),
        valorCorrecao: (montanteCorrigido - montanteInicial).toFixed(2),
        montanteCorrigido: montanteCorrigido.toFixed(2),
        juros: `${juros.toFixed(2).replace(".", ",")}%`,
        dataInicialJuros: juros === 0 || startDateJuros > endDateJuros ? "" : `${startDateJuros.getDate().toString().padStart(2, '0')}/${(startDateJuros.getMonth() + 1).toString().padStart(2, '0')}/${startDateJuros.getFullYear()}`,
        dataFinalJuros: juros === 0 || startDateJuros > endDateJuros ? "" : `${endDateJuros.getDate().toString().padStart(2, '0')}/${(endDateJuros.getMonth() + 1).toString().padStart(2, '0')}/${endDateJuros.getFullYear()}`,
        monthsDifference: monthsDifference.difference.toFixed(2),
        valorJurosMensais: valorJurosMensais.toFixed(2),
        montanteCorrigidoComJuros: montanteCorrigidoComJuros.toFixed(2),
        multa: `${multa.toFixed(2).replace(".", ",")}%`,
        valorMultaCalculada: valorMultaCalculada.toFixed(2),
        montanteCorrigidoComJurosEMulta: montanteCorrigidoComJurosEMulta.toFixed(2),
        honorarios: `${honorarios.toFixed(2).replace(".", ",")}%`,
        valorHonorarios: valorHonorarios.toFixed(2),
        montanteCorrigidoComJurosEMultaEHonorarios: montanteCorrigidoComJurosEMultaEHonorarios.toFixed(2),
        valorTotalSemHonorariosFloat: montanteCorrigidoComJurosEMulta,
        valorTotalFloat: valorTotal,
    };
}

export const gerarCalculo = (calculo, variacoesINPC) => {
    if (variacoesINPC.length === 0) {
        return [];
    }

    let resultingCalculo = [];

    const dia = "01";
    const [mesInicial, anoInicial] = calculo.dataInicial.split('/');
    const dataInicialDate = new Date(`${mesInicial}/${dia}/${anoInicial}`);

    const [mesFinal, anoFinal] = calculo.dataFinal.split('/');
    const dataFinalDate = new Date(`${mesFinal}/${dia}/${anoFinal}`);

    const [diaInicialJuros, mesInicialJuros, anoInicialJuros] = calculo.dataInicialJuros.split('/');
    const dataInicialJurosDate = new Date(`${mesInicialJuros}/${diaInicialJuros}/${anoInicialJuros}`);

    const [diaFinalJuros, mesFinalJuros, anoFinalJuros] = calculo.dataFinalJuros.split('/');
    const dataFinalJurosDate = new Date(`${mesFinalJuros}/${diaFinalJuros}/${anoFinalJuros}`);
    
    const diaFinalCalculo = "01";
    const [mesFinalCalculo, anoFinalCalculo] = calculo.dataFinalCalculo.split('/');
    const dataFinalCalculoDate = new Date(`${mesFinalCalculo}/${diaFinalCalculo}/${anoFinalCalculo}`);

    let currentDate = dataInicialDate;
    let currentDateJuros = dataInicialJurosDate;

    let dataFinalAnalise = calculo.isCalculoUnico ? dataFinalDate : dataFinalCalculoDate;

    while (currentDate <= dataFinalAnalise) {
        let result = calcular(variacoesINPC, calculo, currentDate, dataFinalDate, currentDateJuros, dataFinalJurosDate);
        resultingCalculo.push(result);

        if (calculo.isCalculoUnico) {
            break;
        }

        let currentMonth = currentDate.getMonth();
        let currentMonthJuros = currentDateJuros.getMonth();

        let currentYear = currentDate.getFullYear();
        let currentYearJuros = currentDateJuros.getFullYear();

        if (currentMonth === 11) {
            currentMonth = 0;
            currentYear++;
        } else {
            currentMonth++;
        }

        if (currentMonthJuros === 11) {
            currentMonthJuros = 0;
            currentYearJuros++;
        } else {
            currentMonthJuros++;
        }

        currentDate = new Date(currentYear, currentMonth, currentDate.getDate());
        currentDateJuros = new Date(currentYearJuros, currentMonthJuros, currentDateJuros.getDate());
    }

    return resultingCalculo;
}
