import { sideClient } from 'datocms-client';

export default async function recebedorDeRequests(request, response) {
    if (request.method === 'POST') {
        const TOKEN = '24f624172879883c3042d3126d58d0';

        const client = new SiteClient(TOKEN);

        //validar os dados, antes de sair cadastrando!!!!!!!!!!!!!
        const registroCriado = await client.items.create({ //await vem com async para esperar a resposta
            itemType: "972787", //ID do model criado pelo Dato
            ...response.body,
            // title: "Comunidade",
            // imageUrl: "http://github.com/muritadb.com.png",
            // createrSlug: "murita"
        })

        console.log(TOKEN);
        response.json({
            dados: 'algum dado',
            registroCriado: registroCriado,
        })
        return; //retorno serve para fechar a iteração do IF. garantir que termina no if
    }
    response.status(404).json({
        message: 'Ainda não temos resposta do GET, mas do POST sim'
    })
}