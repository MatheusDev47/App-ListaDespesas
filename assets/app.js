//Carrega o conteúdo da página consulta sem precisar de reload
//$('#consulta').on('click', () => { $('#pagina').load('consulta.html') })

//Criação da classe despesa associando os parâmetros do método constructor aos valores dos campos da função cadastrarDespesa
class Despesa {
    constructor(ano, mes, dia, tipo, descricao, valor) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    //Validação dos campos
    validarDados () {
        for (let i in this) {
            if (this[i] === '' || this[i] === null || this[i] === undefined) {
                return false
            }
        }
        return true
    }
    
    validarDiaEValor () {
        const numDia = Number (this.dia)
        const numValor = Number (this.valor)

        if (!isNaN(numDia) && !isNaN(numValor) && numDia <= 31) {
            return true
        } else {
            return false
        }
    }

}

//Criação da classe bd para manipulação do localStorage e criação de indices dinâmicos
class Bd {

    constructor () {
        //Criação do id
        const id = localStorage.getItem('id')
        //Se for vazio (ou seja, não existir) cria um id com valor 0
        if (id === null) {
            localStorage.setItem('id', 0)
        }
    }

    //Método que retorna o próximo id +1
    getProximoId () {
        const proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }

    //Método que grava toda a despesa no localStorage.
    gravar(despesa) {
        const id = this.getProximoId()
        localStorage.setItem('id', id)
        localStorage.setItem(id, JSON.stringify(despesa))
    }

    recuperarTodosRegistros () {
        const id = localStorage.getItem('id')
        const arrayDespesa = Array()

        for (let i = 1; i <= id; i++) {
            const despesa = JSON.parse(localStorage.getItem(i))
            if (despesa === null) {
                continue
            }
            arrayDespesa.push(despesa)
        }

        return arrayDespesa
    }
}

const bd = new Bd()

//Função para cadastrar despesa
function cadastraDespesa() {
    const ano = $('#ano')
    const mes = $('#mes')
    const dia = $('#dia')
    const tipo = $('#tipo')
    const descricao = $('#descricao')
    const valor = $('#valor')

    //Instância da classe despesa passando como parâmetro para o método constructor os valores dos campos que estão sendo recuperados
    const despesa = new Despesa(
        ano.val(),
        mes.val(),
        dia.val(),
        tipo.val(),
        descricao.val(),
        valor.val()
    )

    if (despesa.validarDados() && despesa.validarDiaEValor()) {
        //lógica para sucesso
        bd.gravar(despesa) 

    } else {
        //lógica para erro
    } 
}

//Função está sendo chamada no carregamento do body da página consulta
function carregaListaDespesas () {
    const despesas = bd.recuperarTodosRegistros()
    const listaDespesas = document.querySelector('#listaDespesas')

     $.each(despesas, (indice, despesas) => {
        const linha = listaDespesas.insertRow()

        function formataData (data) {
            return data >= 10 ? data : `0${data}` 
        }

        linha.insertCell(0).innerHTML = `${formataData(despesas.dia)}/${formataData(despesas.mes)}/${despesas.ano}`

        function formataTipoDespesa (tipo) {
            const arrayTipo = ['Alimentação', 'Educação', 'Lazer', 'Saúde', 'Transporte']
            return arrayTipo[tipo]
        }
        
        linha.insertCell(1).innerHTML = formataTipoDespesa(despesas.tipo)
        linha.insertCell(2).innerHTML = despesas.descricao

        function formataValor (valorDespesa) {
            const valor = despesas.valor
            const valorSeparado = valor.split('.')
            return valorSeparado[1] === undefined ? `${valorDespesa},00` : valorDespesa
        }

        linha.insertCell(3).innerHTML = `R$${formataValor(despesas.valor)}`
     })
}

//Chamada da função quando houver um click sobre o botão de cadastro
$('#btnCadastrar').on('click', () => { cadastraDespesa() })





