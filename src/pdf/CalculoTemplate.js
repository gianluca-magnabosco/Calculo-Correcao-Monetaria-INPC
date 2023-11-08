import React from 'react';
import { Page, Text, View, Document, StyleSheet } from '@react-pdf/renderer';

const mesesExtenso = ["Janeiro", "Fevereiro", "Março", "Abril", "Maio", "Junho", "Julho", "Agosto", "Setembro", "Outubro", "Novembro", "Dezembro"];

const styles = StyleSheet.create({
    container: {
        border: 1.5,
        borderColor: "#ded8cb",
        paddingHorizontal: 4,
        paddingVertical: 1,
        marginBottom: 8,
        justifyContent: 'flex-start',
    },
    itemContainer: {
        border: 1.5,
        borderColor: "#ded8cb",
        paddingHorizontal: 4,
        paddingVertical: 1,
        justifyContent: 'flex-start',
    },
    innerContainer: { 
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'flex-start',
        alignItems: 'center',
    },
    row: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'flex-start',
    },
    rowBetween: {
        display: 'flex',
        flexDirection: 'row',
        justifyContent: 'space-between',
    },
    text: {
        fontSize: 6,
        fontFamily: 'Helvetica',
        paddingVertical: 1,
    },
    textBold: {
        fontSize: 6,
        fontFamily: 'Helvetica-Bold',
        fontWeight: 1000,
        paddingVertical: 1,
    },
    pageNumber: {
        position: 'absolute',
        fontSize: 12,
        bottom: 30,
        left: 0,
        right: 0,
        textAlign: 'center',
        color: 'grey',
    },
});

export const CalculoTemplate = (state) => {

    const {calculo} = state;

    return (
        <Document>
            <Page style={{
                paddingTop: 38,
                paddingBottom: 10,
                paddingHorizontal: 30,
                paddingRight: 245,
            }}>
                <Text style={{
                    fontSize: 7.5,
                    fontWeight: 1000,
                    fontFamily: 'Helvetica-Bold',
                    textAlign: 'left',
                    marginBottom: 10,
                }}>
                    DEMONSTRATIVO DE DÉBITO ATUALIZADO MEMÓRIA DE CÁLCULO
                </Text>

                <View style={styles.container}>
                    <View style={styles.row}>
                        <Text style={{...styles.textBold, paddingRight: 2}}>Processo nº:</Text>
                        <Text style={styles.text}>{calculo.calculo.numProcesso}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={{...styles.textBold, paddingLeft: 6, paddingRight: 2}}>Advogado:</Text>
                        <Text style={styles.text}>{calculo.calculo.advogado}</Text>
                    </View>

                    <View style={styles.row}>
                        <Text style={{...styles.textBold, paddingLeft: 25, paddingRight: 2}}>Data:</Text>
                        <Text style={styles.text}>{new Date().toLocaleDateString('pt-BR')}</Text>
                    </View>
                </View>

                {calculo.calculosArray ? calculo.calculosArray.map((item, index) => {
                    return (
                        <View key={index.toString()}>
                            <View style={styles.itemContainer}>
                                <View style={styles.row}>
                                    <Text style={styles.textBold}>Cálculo - Principal ({index + 1} - {item.descricao})</Text>
                                </View>

                                <View style={{...styles.row, paddingBottom: 7}}>
                                    <Text style={{...styles.textBold, paddingLeft: 6, paddingRight: 2}}>Indexador:</Text>
                                    <View>
                                        <Text style={styles.text}>INPC</Text>
                                        <Text style={styles.text}>Variação: mensal</Text>
                                        <Text style={styles.text}>Corrigido do mês {item.dataInicial} até {item.dataFinal}</Text>
                                    </View>
                                </View>

                                <View style={styles.row}>
                                    <Text style={{...styles.textBold, paddingLeft: 20, paddingRight: 2}}>Juros:</Text>
                                    <Text style={styles.text}>{`${item.juros} ao Mês/Simples${(Number(item.juros.replace(",", ".").replace("%", "")) === 0 || item.dataInicialJuros === "" || item.dataFinalJuros === "") ? "" : ` - desde ${item.dataInicialJuros} até ${item.dataFinalJuros}`} - ${item.monthsDifference} meses de juros`}</Text>
                                </View>

                                <View style={styles.row}>
                                    <Text style={{...styles.textBold, paddingLeft: 21, paddingRight: 2}}>Multa:</Text>
                                    <Text style={styles.text}>{item.multa} (percentual de multa)</Text>
                                </View>
                            </View>

                            <View style={{...styles.container, marginTop: -1, paddingBottom: 15, paddingHorizontal: 8}}>
                                <View style={{...styles.row, alignContent: 'space-between', justifyContent: 'space-between'}}>
                                    <View style={styles.innerContainer}>
                                        <Text style={styles.textBold}>Descrição</Text>
                                        <Text style={styles.text}>principal</Text>
                                    </View>

                                    <View style={styles.innerContainer}>
                                        <Text style={styles.textBold}>Data final Juros</Text>
                                        <Text style={styles.text}>{Number(item.juros.replace(",", ".").replace("%", "")) === 0 ? "" : `${item.dataFinalJuros}`}</Text>
                                    </View>

                                    <View style={styles.innerContainer}>
                                        <Text style={styles.textBold}>Moeda</Text>
                                        <Text style={styles.text}>R$</Text>
                                    </View>

                                    <View style={styles.innerContainer}>
                                        <Text style={styles.textBold}>Valor</Text>
                                        <Text style={styles.text}>{item.montanteInicial.replace(".", ",")}</Text>
                                    </View>

                                    <View style={styles.innerContainer}>
                                        <Text style={styles.textBold}>Indice</Text>
                                        <Text style={styles.text}>INPC</Text>
                                    </View>

                                    <View style={styles.innerContainer}>
                                        <Text style={styles.textBold}>Corrigido</Text>
                                        <Text style={styles.text}>{item.montanteCorrigido.replace(".", ",")}</Text>
                                    </View>

                                    <View style={styles.innerContainer}>
                                        <Text style={styles.textBold}>Juros</Text>
                                        <Text style={styles.text}>{item.valorJurosMensais.replace(".", ",")}</Text>
                                    </View>

                                    <View style={styles.innerContainer}>
                                        <Text style={styles.textBold}>Multa</Text>
                                        <Text style={styles.text}>{item.valorMultaCalculada.replace(".", ",")}</Text>
                                    </View>

                                    <View style={styles.innerContainer}>
                                        <Text style={styles.textBold}>Atualizado</Text>
                                        <Text style={styles.text}>{item.montanteCorrigidoComJurosEMulta.replace(".", ",")}</Text>
                                    </View>
                                </View>
                            </View>
                        </View>
                    );
                })
                : null
                }
                
                <View style={{...styles.container, marginTop: 10}}>
                    <View style={styles.rowBetween}>
                        <Text style={styles.textBold}>Descrição</Text>
                        <Text style={styles.textBold}>Valor Atualizado</Text>
                    </View>

                    <View style={styles.rowBetween}>
                        <Text style={styles.text}>Débito do Executado</Text>
                        <Text style={styles.text}>{Number(calculo.debitoDoExecutado).toLocaleString('pt-br', {style: 'currency', currency: 'BRL'}).replace("R$", "")}</Text>
                    </View>
                    <View style={styles.rowBetween}>
                        <Text style={styles.text}>Honorários ({calculo.calculo.honorarios === "" ? "0,00" : calculo.calculo.honorarios} %)</Text>
                        <Text style={styles.text}>{Number(calculo.debitoValorHonorarios).toLocaleString('pt-br', {style: 'currency', currency: 'BRL'}).replace("R$", "")}</Text>
                    </View>
                </View>

                <View style={styles.container}>
                    <View style={styles.rowBetween}>
                        <Text style={styles.textBold}>Total Geral</Text>
                        <Text style={styles.textBold}>{Number(calculo.totalGeral).toLocaleString('pt-br', {style: 'currency', currency: 'BRL'})}</Text>
                    </View>
                </View>

                <Text style={{...styles.textBold, textAlign: "right"}}>
                    {calculo.cidade ? `${calculo.cidade}, ` : ""}{new Date().getDate().toString().padStart(2, '0')} de {mesesExtenso[new Date().getMonth()]} de {new Date().getFullYear()}
                </Text>
            </Page>
        </Document>
    );
}
