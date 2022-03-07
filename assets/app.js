//Carrega o conteúdo da página consulta sem precisar de reload
// $('#consulta').on('click', () => { $('#pagina').load('consulta.html') })

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
    validarDados() {
        for (let i in this) {
            if (this[i] === '' || this[i] === null || this[i] === undefined) {
                return false
            }
        }
        return true
    }

    validarDiaEValor() {
        const numDia = Number(this.dia)
        const numValor = Number(this.valor)

        if (!isNaN(numDia) && !isNaN(numValor) && numDia <= 31) {
            return true
        } else {
            return false
        }
    }

}

//Criação da classe bd para manipulação do localStorage e criação de indices dinâmicos
class Bd {

    constructor() {
        //Criação do id
        const id = localStorage.getItem('id')
        //Se for vazio (ou seja, não existir) cria um id com valor 0
        if (id === null) {
            localStorage.setItem('id', 0)
        }
    }

    //Método que retorna o próximo id +1
    getProximoId() {
        const proximoId = localStorage.getItem('id')
        return parseInt(proximoId) + 1
    }

    //Método que grava toda a despesa no localStorage.
    gravar(despesa) {
        const id = this.getProximoId()
        localStorage.setItem('id', id)
        localStorage.setItem(id, JSON.stringify(despesa))
    }

    recuperarTodosRegistros() {
        const id = localStorage.getItem('id')
        const arrayDespesa = Array()

        for (let i = 1; i <= id; i++) {
            const despesa = JSON.parse(localStorage.getItem(i))
            if (despesa === null) {
                continue
            }

            despesa.id = i
            arrayDespesa.push(despesa)
        }

        return arrayDespesa
    }

    pesquisar(despesa) {
        let despesaFiltrada = Array()
        despesaFiltrada = this.recuperarTodosRegistros()

        if (despesa.ano !== '') {
            despesaFiltrada.filter(d => d.ano === despesa.ano)
        }

        if (despesa.mes !== '') {
            despesaFiltrada = despesaFiltrada.filter(d => d.mes === despesa.mes)
        }

        if (despesa.dia !== '') {
            despesaFiltrada = despesaFiltrada.filter(d => d.dia === despesa.dia)
        }

        if (despesa.tipo !== '') {
            despesaFiltrada = despesaFiltrada.filter(d => d.tipo === despesa.tipo)
        }

        if (despesa.descricao !== '') {
            despesaFiltrada = despesaFiltrada.filter(d => d.descricao === despesa.descricao)
        }

        if (despesa.valor !== '') {
            despesaFiltrada = despesaFiltrada.filter(d => d.valor === despesa.valor)
        }

        return despesaFiltrada
    }

    apagarDespesa(id) {
        localStorage.removeItem(id)
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

    const modal = $('#modalDespesa')

    if (despesa.validarDados() && despesa.validarDiaEValor()) {
        bd.gravar(despesa)

        modal.find('.modal-title').removeClass(["text-success", "text-danger"])
        modal.find('.modal-footer button').removeClass(["btn-success", "btn-danger"])

        modal.find('.modal-title').html('Sucesso')
        modal.find('.modal-title').addClass('text-success')
        modal.find('.modal-body p').html('SUA DESPESA FOI CADASTRADA COM SUCESSO')
        modal.find('.modal-footer button').addClass('btn-success')
        modal.modal('show')

        ano.val('')
        mes.val('')
        dia.val('')
        tipo.val('')
        descricao.val('')
        valor.val('')

    } else {
        modal.find('.modal-title').removeClass(["text-success", "text-danger"])
        modal.find('.modal-footer button').removeClass(["btn-success", "btn-danger"])

        modal.find('.modal-title').html('Erro')
        modal.find('.modal-title').addClass('text-danger')
        modal.find('.modal-body p').html('ERRO AO CADASTRAR SUA DESPESA')
        modal.find('.modal-footer button').addClass('btn-danger')
        modal.modal('show')
    }
}

function adicionaDespesaLista(despesa) {
    const listaDespesas = document.querySelector('#listaDespesas')
    listaDespesas.innerHTML = ''

    despesa.map(d => {
        const linha = listaDespesas.insertRow()

        function formataData(data) {
            return data.length === 1 ? `0${data}` : data
        }

        linha.insertCell(0).innerHTML = `${formataData(d.dia)}/${formataData(d.mes)}/${d.ano}`

        function formataTipoDespesa(tipo) {
            const arrayTipo = ['Alimentação', 'Educação', 'Lazer', 'Saúde', 'Transporte'];
            return arrayTipo[tipo]
        }

        linha.insertCell(1).innerHTML = formataTipoDespesa(d.tipo)
        linha.insertCell(2).innerHTML = d.descricao

        function formataValor(valorDespesa) {
            const valor = d.valor
            const valorSeparado = valor.split('.')
            return valorSeparado[1] === undefined ? `${valorDespesa},00` : valorDespesa
        }

        linha.insertCell(3).innerHTML = `R$${formataValor(d.valor)}`

        const btnDelete = document.createElement('i')
        btnDelete.className = "bi bi-x-square-fill text-danger h3"
        btnDelete.setAttribute('style', 'cursor: pointer')
        btnDelete.id = `apagaDespesa_${d.id}`
        btnDelete.onclick = e => {
            const idBtn = e.target.id
            const idClick = idBtn.replace('apagaDespesa_', '')
            bd.apagarDespesa(idClick)
            window.location.reload()
        }
        linha.insertCell(4).append(btnDelete)

    })
}

//Função está sendo chamada no carregamento do body da página consulta
function carregaListaDespesas() {
    const despesas = bd.recuperarTodosRegistros()
    adicionaDespesaLista(despesas)

    // if (despesa.length === 0 && filtro === false) {
    //     despesa = bd.recuperarTodosRegistros()
    // }
}

function filtrarDespesa() {
    const ano = $('#ano').val()
    const mes = $('#mes').val()
    const dia = $('#dia').val()
    const tipo = $('#tipo').val()
    const descricao = $('#descricao').val()
    const valor = $('#valor').val()

    const despesas = new Despesa(ano, mes, dia, tipo, descricao, valor)
    const despesaFiltrada = bd.pesquisar(despesas)
    adicionaDespesaLista(despesaFiltrada)
    //carregaListaDespesas(despesaFiltrada, true)
}

$('#btnCadastrar').click(() => { cadastraDespesa() })
$('body').keyup(e => {
    if (e.key === "Enter") {
        cadastraDespesa()
    }
})
$('#pesquisarDespesa').click(() => { filtrarDespesa() })
$('body').keyup(e => {
    if (e.key === "Enter") {
        filtrarDespesa()
    }
})

const darkMode = localStorage.getItem('darkMode')
const body = document.querySelector("body")
const text = document.querySelector("h1")
const table = document.querySelector("table")
const checkbox = document.querySelector("input[name=theme]")

const applyDarkMode = () => {
    body.setAttribute("style", "background-color: var(--back-color)")
    text.setAttribute("style", "color: var(--color-text)")
    table.setAttribute("style", "color: var(--color-text)")
    localStorage.setItem('darkMode', 'enabled')
}

const initialMode = () => {
    body.removeAttribute("style")
    text.removeAttribute("style")
    table.removeAttribute("style")
}

if (darkMode === 'enabled') {
    applyDarkMode()
    checkbox.setAttribute('checked', true)
}

checkbox.addEventListener("change", ({target}) => {
    if (target.checked) {
        applyDarkMode()

    } else {
        initialMode()
        localStorage.setItem('darkMode', null)
    }
})






