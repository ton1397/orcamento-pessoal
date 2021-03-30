class Despesa{
    constructor(ano, mes, dia, tipo, descricao, valor){
        this.ano = ano
        this.mes = mes
        this.dia = dia
        this.tipo = tipo
        this.descricao = descricao
        this.valor = valor
    }

    validarDados(){
        for (let i in this) {
            console.log(this[i])
            if (this[i] == undefined || this[i] == '' || this[i] == null) {
                return false;
            }
        }
        return true;
    }
}

class BD{

    constructor(){
        let id = localStorage.getItem('id')
        if (id === null) {
            localStorage.setItem('id', 0)
        }
    }

    getProximoId(){
        let proximoId = localStorage.getItem('id')
        return parseInt(proximoId)+1
    }

    gravar(d){
        let proximoId = this.getProximoId()
        localStorage.setItem(proximoId, JSON.stringify(d))
        localStorage.setItem('id',proximoId)
    }

    recuperarTodosRegsitros(){
        let objDespesas = []
        for (let i = 1; i <= parseInt(localStorage.getItem('id')); i++) {
            let despesa = JSON.parse(localStorage.getItem(i))
            if (despesa === null) {
                continue
            }
            despesa.id = i
            objDespesas.push(despesa)
        }
        return objDespesas
    }

    pesquisar(despesa){
        let objDespesas = this.recuperarTodosRegsitros()
        if (despesa.ano != '') {
            objDespesas = objDespesas.filter(r => r.ano == despesa.ano)   
        }
        if (despesa.mes != '') {
            objDespesas = objDespesas.filter(r => r.mes == despesa.mes)   
        }
        if (despesa.dia != '') {
            objDespesas = objDespesas.filter(r => r.dia == despesa.dia)   
        }
        if (despesa.tipo != '') {
            objDespesas = objDespesas.filter(r => r.tipo == despesa.tipo)   
        }
        if (despesa.descricao != '') {
            objDespesas = objDespesas.filter(r => r.descricao.toLowerCase().includes(despesa.descricao))   
        }
        if (despesa.valor != '') {
            objDespesas = objDespesas.filter(r => r.valor == despesa.valor)   
        }
        return objDespesas
    }

    removerDespesa(id){
        localStorage.removeItem(id)
    }
}

let bd = new BD()

function CadastrarDespesa(){
    let ano = document.getElementById('ano')
    let mes = document.getElementById('mes')
    let dia = document.getElementById('dia')
    let tipo = document.getElementById('tipo')
    let descricao = document.getElementById('descricao')
    let valor = document.getElementById('valor')
    let despesa = new Despesa(ano.value, mes.value, dia.value, tipo.value, descricao.value, valor.value)
    if (despesa.validarDados()) {
        bd.gravar(despesa)
        document.getElementById('tituloModalDespesa').className = 'modal-title text-success'
        document.getElementById('tituloModalDespesa').innerText = 'Registro inserido com sucesso'
        document.getElementById('conteudoModalDespesa').innerText = 'Despesa cadastrada com sucesso!'
        document.getElementById('btnVoltarModalDespesa').className = 'btn btn-success'
        document.getElementById('btnVoltarModalDespesa').innerText = 'Voltar'
        document.getElementById('FormCadDespesa').reset()
        $('#registraDespesa').modal('show')
    } else {
        document.getElementById('tituloModalDespesa').className = 'modal-title text-danger'
        document.getElementById('tituloModalDespesa').innerText = 'Erro na gravação'
        document.getElementById('conteudoModalDespesa').innerText = 'Existem campos obrigatórios que não foram preenchidos'
        document.getElementById('btnVoltarModalDespesa').className = 'btn btn-danger'
        document.getElementById('btnVoltarModalDespesa').innerText = 'Voltar e corrigir'
        $('#registraDespesa').modal('show')
    }
}

function carregaConsulta(){
    let despesas = bd.recuperarTodosRegsitros()
    carregaListaDespesa(despesas)
}

function carregaListaDespesa(despesas){
    let listaDespesas = document.getElementById('listaDespesas')
    listaDespesas.innerHTML = ''
   despesas.forEach(d => {
       let linha = listaDespesas.insertRow()
       switch (d.tipo) {
           case '1':
               d.tipo = 'Alimentação'
               break;
           case '2':
               d.tipo = 'Educação'
               break;
           case '3':
               d.tipo = 'Lazer'
               break;
           case '4':
               d.tipo = 'Saúde'
               break;
           case '5':
               d.tipo = 'Transporte'
               break;
       
           default:
               break;
       }
       linha.insertCell(0).innerHTML = `${d.dia}/${d.mes}/${d.ano}`
       linha.insertCell(1).innerHTML = d.tipo
       linha.insertCell(2).innerHTML = d.descricao
       linha.insertCell(3).innerHTML = d.valor
       let btn = document.createElement('button')
       btn.className = 'btn btn-danger'
       btn.id = `id_despesa_${d.id}`
       btn.innerHTML = '<i class="fas fa-times"></i>'
       btn.onclick = function(){
            let id = this.id.replace('id_despesa_','')
            bd.removerDespesa(id)
            document.getElementById('tituloModalDespesa').className = 'modal-title text-success'
            document.getElementById('tituloModalDespesa').innerText = 'Registro removido com sucesso'
            document.getElementById('conteudoModalDespesa').innerText = 'Despesa excluída com sucesso!'
            document.getElementById('btnVoltarModalDespesa').className = 'btn btn-success'
            document.getElementById('btnVoltarModalDespesa').innerText = 'Voltar'
            $('#removeDespesa').modal('show')
       }
       linha.insertCell(4).append(btn)
   })
}

function pesquisaDespesa(){
    let ano = document.getElementById('ano').value
    let mes = document.getElementById('mes').value
    let dia = document.getElementById('dia').value
    let tipo = document.getElementById('tipo').value
    let descricao = document.getElementById('descricao').value
    let valor = document.getElementById('valor').value
    let despesa = new Despesa(ano, mes, dia, tipo, descricao, valor)

    let despesas = bd.pesquisar(despesa)
    carregaListaDespesaTeste(despesas)
}

function carregaGrafico(){
    let despesas = bd.recuperarTodosRegsitros()
    let meses = ['Janeiro', 
                'Fevereiro', 
                'Março', 
                'Abril', 
                'Maio', 
                'Junho', 
                'Julho', 
                'Agosto', 
                'Setembro', 
                'Outubro', 
                'Novembro', 
                'Dezembro']
    let mesValor = Array()
    meses.forEach((mes,i) => {
        mesValor.push(0)
        despesas.forEach(d => {
            if (d.mes == i+1) {
                let valor = d.valor.replace(',','.')
                if (mesValor[i] != 0) {
                    mesValor[i] += parseFloat(valor)
                } else {
                    mesValor[i] = parseFloat(valor)   
                }
            }
        })
    })
    var ctx = document.getElementById('myChart').getContext('2d');
    var chart = new Chart(ctx, {
        // The type of chart we want to create
        type: 'line',

        // The data for our dataset
        data: {
            labels: meses,
            datasets: [{
                label: 'Meu Gráfico de Despesas',
                backgroundColor: '#FF6384',
                borderColor: '#FF6384',
                data: mesValor
            }]
        },

        // Configuration options go here
        options: {}
    });
}