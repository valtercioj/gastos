/* eslint-disable @next/next/no-title-in-document-head */
import { Html, Head, Main, NextScript } from "next/document";
import { useEffect } from "react";

export default function Document() {
  // Usando useEffect para alterar o título no lado do cliente após o carregamento
  useEffect(() => {
    const getTitle = () => {
      const { hostname } = window.location;

      // Verifica se o domínio é Vercel
      if (hostname.includes("vercel.app")) {
        return hostname.split(".")[0]; // "sigsports" no caso do Vercel
      }

      // Se for localhost
      if (hostname === "localhost") {
        return "localhost";
      }

      return hostname; // Caso contrário, retorna o hostname completo
    };

    // Modificando o título dinamicamente
    document.title = getTitle();
  }, []); // O array vazio garante que isso seja feito apenas uma vez após o carregamento da página

  return (
    <Html lang="en">
      <Head>
        <link rel="icon" href="/SIGSport.svg" />
        <meta
          name="description"
          content="Plataforma de gerenciamento de esportes"
        />
      </Head>

      <body className="h-screen bg-bgGray">
        <Main />
        <NextScript />
      </body>
    </Html>
  );
}
