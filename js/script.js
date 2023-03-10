class Despesa {
    constructor( ano, mes, dia, tipo, descricao, valor ) {
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados() {
        for ( let i in this ) {
            if (this[i] === '' || this[i] === null || this[i] === undefined) {
                return false
            } 
        }

        return true
    }
}

class Bd {
    constructor() {
        let id = localStorage.getItem('id')
        
        if ( id === null ) localStorage.setItem('id', 0)
    }

    getProximoId() {
        let proximoId = localStorage.getItem('id')
        return parseInt( proximoId ) + 1
    }

    gravarDespesa( paramDespesa ) {
        // JSON.stringify(): converte uma objeto literal para uma string JSON.
        // JSON.parse(): faz o inverso de JSON.stringify().
        let id = this.getProximoId()
        
        localStorage.setItem(id, JSON.stringify( paramDespesa ))
        localStorage.setItem('id', id)
    }

    recuperarRegistros() {
        let despesas = []

        let id = localStorage.getItem('id')

        for (let i = 1; i <= id; i++) {
            let despesa = JSON.parse( localStorage.getItem(i) )
            
            if ( despesa === null ) continue

            despesa.id = i
            despesas.push( despesa )
        }

        return despesas
    }

    pesquisar( despesa ) {
        let despesasFiltradas = []

        despesasFiltradas = this.recuperarRegistros()

        if ( despesa.ano !== '' ) {
            despesasFiltradas = despesasFiltradas.filter( d => d.ano === despesa.ano )
        }

        if ( despesa.mes !== '' ) {
            despesasFiltradas = despesasFiltradas.filter( d => d.mes === despesa.mes )
        }

        if ( despesa.dia !== '' ) {
            despesasFiltradas = despesasFiltradas.filter( d => d.dia === despesa.dia )
        }

        if ( despesa.tipo !== '' ) {
            despesasFiltradas = despesasFiltradas.filter( d => d.tipo === despesa.tipo )
        }

        if ( despesa.descricao !== '' ) {
            despesasFiltradas = despesasFiltradas.filter( d => d.descricao === despesa.descricao )
        }

        if ( despesa.valor !== '' ) {
            despesasFiltradas = despesasFiltradas.filter( d => d.valor === despesa.valor )
        }
        
        return despesasFiltradas
    }

    remover( id ) {
        localStorage.removeItem( id )
    }
}

let bd = new Bd()

function cadastrarDespesa() {
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')

    let despesa = new Despesa(
        ano.value,
        mes.value,
        dia.value,
        tipo.value,
        descricao.value,
        valor.value
    )

    if ( despesa.validarDados() ) {
        bd.gravarDespesa( despesa )

        document.getElementById('modalRegistroDespesaTitle').innerHTML = 'Sucesso na gravação'
        document.getElementById('modalRegistroDespesaTitle').className = 'text-success'
        document.getElementById('modalRegistroDespesaText').innerHTML = 'Despesa gravada com êxito!'
        document.getElementById('divModalTitle').className = 'modal-header text-success'
        document.getElementById('buttonModalRegDespesa').className = 'btn btn-success'
        document.getElementById('buttonModalRegDespesa').innerHTML = 'Fechar'

        $('#modalRegistroDespesa').modal('show')

        ano.value = ''
        mes.value = ''
        dia.value = ''
        tipo.value = ''
        descricao.value = ''
        valor.value = ''
    } else {
        document.getElementById('modalRegistroDespesaTitle').innerHTML = 'Erro na gravação do registro'
        document.getElementById('modalRegistroDespesaTitle').className = 'text-danger'
        document.getElementById('modalRegistroDespesaText').innerText = 'Um ou mais dados não foi inserido corretamente!'
        document.getElementById('divModalTitle').className = 'modal-header text-success'
        document.getElementById('buttonModalRegDespesa').className = 'btn btn-danger'
        document.getElementById('buttonModalRegDespesa').innerHTML = 'Voltar e corrigir'

        $('#modalRegistroDespesa').modal('show')
    }
}

function carregaListaDespesas( despesas = [], filtro = false ) {
    
    if ( despesas.length === 0 && filtro === false ) {
        despesas = bd.recuperarRegistros()
    }

    let listaDespesas = document.getElementById('listaDespesa')
    listaDespesas.innerHTML = ''

    despesas.forEach(function(d) {
        console.log(d)
        let row = listaDespesas.insertRow()
        
        row.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`

        switch (parseInt(d.tipo)) {
            case 1: d.tipo = 'Alimentação'
                break
            case 2: d.tipo = 'Educação'
                break
            case 3: d.tipo = 'Lazer'
                break
            case 4: d.tipo = 'Saúde'
                break
            case 5: d.tipo = 'Transporte'
                break
        }

        row.insertCell(1).innerHTML = d.tipo
        row.insertCell(2).innerHTML = d.descricao
        row.insertCell(3).innerHTML = d.valor

        // Criar button
        let btn = document.createElement('button')
        btn.id = `id_despesa_${d.id}`
        btn.className = 'btn btn-danger'
        btn.innerHTML = '<i class="fas fa-times"></i>'
        btn.onclick = function() {
            let id = parseInt( this.id.replace('id_despesa_', '') )
            bd.remover( id )
            window.location.reload()
        }
        row.insertCell(4).append( btn )
    })
}

function pesquisarDespesa() {
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value

    let despesa = new Despesa( ano, mes, dia, tipo, descricao, valor )

    let despesas = bd.pesquisar( despesa )

    carregaListaDespesas( despesas, true )
}