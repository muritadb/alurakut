import React from 'react';
import MainGrid from '../src/components/MainGrid';
import Box from '../src/components/Box';
import { AlurakutMenu, AlurakutProfileSidebarMenuDefault, OrkutNostalgicIconSet } from '../src/lib/AlurakutCommons';

import { ProfileRelationsBoxWrapper } from '../src/components/ProfileRelations';


function ProfileSidebar(props) {
  return (
    <Box as="aside">
      <img src={`https://github.com/${props.githubUser}.png`} style={{ borderRadius: '8px' }} />
      <hr />
      <p>
        <a className="boxLink" href={`{https://github.com/${props.githubUser}`}>
          @{props.githubUser}
        </a>
      </p>
      <hr />

      <AlurakutProfileSidebarMenuDefault />
    </Box>
  )
}

function ProfileRelationsBox(props) {
  return (
    <ProfileRelationsBoxWrapper>
      <h2 className="smallTitle">
        {props.title} ({props.items.length})
      </h2>

      <ul>
        {/* {seguidores.map((itemAtual) => {
        return (
          <li key={itemAtual.id}>
            <a href={`https://github.com/${itemAtual}.png`} >
              <img src={itemAtual.image} />
              <span>{itemAtual.title}</span>
            </a>
          </li>
        )
      })}  */}
      </ul>
    </ProfileRelationsBoxWrapper>
  )
}

export default function Home() {
  const usuarioAleatorio = 'muritadb';
  const [comunidades, setComunidades] = React.useState([]);
  const pessoasFavoritas = ['jaydson', 'omariosouto', 'willianjusten', 'felipefialho', 'anabastos', 'peas']

  const [seguidores, setSeguidores] = React.useState([]);

  React.useEffect(function () {
    //GET
    fetch('https://api.github.com/users/muritadb/followers')
      .then(function (respostaDoServidor) {
        return respostaDoServidor.json();
      })
      .then(function (respostaCompleta) {
        setSeguidores(respostaCompleta);
      })

    // API GraphQL 
    fetch('https://graphql.datocms.com/', {
      method: 'POST',
      headers: { //infos vem do datocms
        'Authorization': 'e13bc09f11601fc139d8c9573e9984',
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        "query": `query { 
        allCommunities {
          id
          title
          imageUrl
          createrSlug
      } 
    }` })
    })
      .then((respostaDoDato) => respostaDoDato.json()) // pega o retorno do resposta do Dato como arrow function em formato JSON
      .then((respostaDoDatoCompleta) => {
        const comunidadesVindaDoDato = respostaDoDatoCompleta.data.allCommunities; // armazenando dados do cms em uma variavel

        setComunidades(comunidadesVindaDoDato);

        console.log(comunidades)
      })
  }, [])

  return (
    <>
      <AlurakutMenu />
      <MainGrid>
        <div className="profileArea" style={{ gridArea: 'profileArea' }}>
          <ProfileSidebar githubUser={usuarioAleatorio} />
        </div>

        <div className="welcomeArea" style={{ gridArea: 'welcomeArea' }}>
          <Box>
            <h1 className="title">
              bem vindo(a)

              <OrkutNostalgicIconSet />
            </h1>
          </Box>
          <Box>
            <h2 className="subTitle">O que você deseja?</h2>

            <form onSubmit={function handleCriaComunidade(e) {
              e.preventDefault();

              const dadosForm = new FormData(e.target); //armazenando valores do formulario em uma variavel

              const comunidade = {
                title: dadosForm.get('title'),
                imageUrl: dadosForm.get('image'),
                createrSlug: usuarioAleatorio,
              }
              //fetch para fazer o POST para a API
              fetch('/api/comunidades', {
                method: 'POST',
                headers: {
                  'Content-Type': 'application/json',
                },
                body: JSON.stringify(comunidade)
              })
                .then(async (response) => {
                  const dados = await response.json();
                  console.log(dados.registroCriado);
                  const comunidade = dados.registroCriado;

                  const comunidadesAtualizadas = [...comunidades, comunidade];
                  setComunidades(comunidadesAtualizadas);
                })

            }}>
              <div>
                <input
                  placeholder="Qual o nome da sua comunidade?"
                  name="title"
                  aria-label="Qual o nome da sua comunidade?"
                  type="text"
                />
              </div>
              <div>
                <input
                  placeholder="Coloque uma URL para usamos de capa"
                  name="image"
                  aria-label="Coloque uma URL para usamos de capa "
                />
              </div>
              <button>Criar comunidade</button>
            </form>
          </Box>
        </div>

        <div className="profileRelationsArea" style={{ gridArea: 'profileRelationsArea' }}>
          <ProfileRelationsBox title="Seguidores" items={seguidores} />
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Comunidades({comunidades.length})
            </h2>
            <ul>
              {comunidades.map((itemAtual) => {
                return (
                  <li key={itemAtual.id}>
                    <a href={`/communities/${itemAtual.id}`} >
                      <img src={itemAtual.imageUrl} />
                      <span>{itemAtual.title}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
          <ProfileRelationsBoxWrapper>
            <h2 className="smallTitle">
              Pessoas da Comunidade({pessoasFavoritas.length})
            </h2>

            <ul>
              {pessoasFavoritas.map((itemAtual) => {
                return (
                  <li key={itemAtual}>
                    <a href={`/users/${itemAtual}`} >
                      <img src={`https://github.com/${itemAtual}.png`} />
                      <span>{itemAtual}</span>
                    </a>
                  </li>
                )
              })}
            </ul>
          </ProfileRelationsBoxWrapper>
        </div>
      </MainGrid>
    </>
  );
}
