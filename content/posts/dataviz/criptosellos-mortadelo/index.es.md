---
title: Sobre los criptosellos de Mortadelo y Filemón
lastmod: 2024-07-27T15:50:39.829Z
---

Hace bien poco Correos España ha decidido sacar al mercado una colección de "Criptosellos". Además del sello especial (que puede ser usado con un valor nominal de 10€) con su cajita y toda la parafernalia, te entregan un código que puede ser canjeado para obtener un NFT.

A grosso modo, un NFT o Token no Fungible es una representación de un activo (digital o físico) implementado en blockchain. Usa la tecnología de las criptomonedas pero no se pueden dividir, y dos NFTs no son equivalentes entre sí. Por ejemplo, 5 euros son 5 euros, estén en billetes, en monedas, en un cheque, o en tu saldo. En los NFTs, pueden representar activos únicos (la escritura de tu casa) o que haya un número determinado e indivisible de activos iguales, como puede haber varios cromos iguales en una colección (**sellos** en este caso).

Aunque el blockchain tiene mala fama por [consumir más electricidad que países como Argentina](https://es.cointelegraph.com/news/in-2023-bitcoin-mining-consumed-more-than-one-third-of-mexicos-electrical-energy), esto es culpa íntegra de Bitcoin, pues Ethereum ya no tiene ese problema desde que se actualizó a Ethereum 2.0 hace unos cuantos años. Además, el NFT de Correos se encuentra en una red alternativa llamada Polygon, que es una cadena similar a Ethereum pero mucho más rápida y eficiente (también energéticamente).

En ese aspecto Correos no lo ha hecho nada mal, pero es que las dos principales razones para usar un blockchain son la **transparencia** y la **descentralización**. En el resto del post analizaremos los criptosellos desde estas perspectivas, y finalmente analizaré si se están usando o no, y como. 

## Transparencia

Empezamos mal: no han publicado la dirección del contrato inteligente, y por lo tanto perdemos una de las pocas ventajas que tenía usar esta tecnología.

Como investigador en estas movidas he conseguido llegar hasta el contrato por mis propios medios, que tiene la dirección [`0x8fA19F4316dF640e14b30B2fE749cbdd79Da9335`](https://polygon.blockscout.com/token/0x8fA19F4316dF640e14b30B2fE749cbdd79Da9335).

> Actualización 14 de Junio 2024: Ha habido alguna movida y resulta que han _migrado_ el contrato [a otra dirección](https://polygon.blockscout.com/token/0x4D5D215c47a43B38a58Abf735b628cF9b61273a0), de una manera un tanto cutre que detallaré en el siguiente apartado.

Tampoco publican el código fuente del contrato inteligente, por lo que los usuarios no pueden auditar cómo funciona el contrato y si está bien hecho. Tal vez haya un error informático que permita a alguien hacerse con todos los criptosellos, y nunca podamos saberlo.

Sin embargo, como las transferencias en el blockchain son transparentes, sí que podemos saber quiénes son los poseedores de los exclusivos NFTs de Mortadelo y Filemón. 
## Descentralización

Por otro lado, desde el punto de vista de la **descentralización** la solución tambien deja mucho que desear. Normalmente, los NFTs utilizan soluciones descentralizadas que permiten usarlo dentro del extenso ecosistema web3: ponertelo de imagen de perfil en una red social, exponerlo en una galería virtual, usarlo en algún juego...
En el caso del criptosello es necesario utilizar sí o sí la aplicación de la web de correos para ver la imagen asociada. Si en un par de años la consultora contratada deja de dar soporte a esta web, ya no podrás acceder a tu criptosello.

> **Si los criptosellos no son ni transparentes ni decentralizados, ¿para que existen?**

Pues supongo que para incrementar el valor de los sellos y que lo compre más gente, ¿no? Aunque no sabemos cuantos sellos se han vendido, sí que podemos saber cuantos de ellos han sido "canjeados" en la blockchain, y el perfil de los usuarios que lo han hecho.

> Este post se actualiza automáticamente con nuevos datos. La última actualización fue el {{< data/text id="criptosellos-last-update" file="general-data.json">}}.
 
Se han reclamado un total de {{< data/text id="criptosellos-total-tokens" >}} criptosellos,
una media de {{< data/text id="criptosellos-daily-avg">}} al día.

Sin embargo, esto no significa que haya cientos de personas comprándolos, en realidad tan solo {{< data/text id="criptosellos-total-holders" >}} carteras distintas tienen al menos un criptosello. No podemos decir que son usuarios distintos pues, al igual que con un correo electrónico, nada impide que un usuario se cree varias cuentas. En el mundo cripto esto es muy normal: tener una cartera con una clave muy robusta en la que almacenar tus criptocosas a largo plazo, y otra más accesible (en el móvil, por ejemplo) que si hackean no pasa nada.

Cada usuario que tenga al menos un criptosello en posesión se denomina _holder_. Aunque cada _holder_ tiene una media de {{< data/text id="criptosellos-holder-avg" >}} sellos, ocurre como en el famoso dicho de «si yo me como dos pollos y tu ninguno, de media nos hemos comido un pollo cada uno».

La realidad es que hay un usuario con muchos más NFTs que el resto: el usuario {{<data/text id="criptosellos-holder-whale-address">}}, que tiene **{{<data/text id="criptosellos-holder-whale-count" >}} criptosellos** en posesión. Por otro lado, la gran mayoría de usuarios ({{< data/text id="criptosellos-holder-oneortwo-cnt" >}}) tiene uno o dos.

{{<data/chart 
    id="criptosellos-holders-chart" 
    file="holders.csv"
    title="Cantidad de criptosellos por usuario"
    caption="Los usuarios con pocos sellos (cuatro o menos) han sido agrupados para que no molesten y se muestra el total. Al poner el ratón encima se muestra la dirección completa o el número de usuarios."
>}}

Otra pregunta que nos puede surgir es si los usuarios tienen sellos de otras colecciones o no. Es decir, si eran ya conocedores de esta tecnología, o si, por el contrario, ha sido Mortadelo quien los ha traído hasta aquí.

Curiosamente, la cartera que más criptosellos tiene, **NO** tenía ningún NFT con anterioridad, aunque tal vez tenga otra cuenta en la que sí que tenga alguno, nunca podremos saberlo.

En general, tan solo un {{<data/text id="criptosellos-holders-had-nfts-avg">}} de los usuarios habían tenido al menos un NFT en su cartera. Ni si quiera sabemos si lo han comprado ellos, o si ha sido recibido como regalo (o como SPAM), por lo que no podemos afirmar que esos pocos usuarios son _criptoentusiastas_. Lo que si podemos afirmar con seguridad es que {{<data/text id="criptosellos-holders-had-nfts-avg-not">}} o más **no habían utilizado NFTs nunca antes**.

> Nótese que estoy mirando no solo en la cadena polygon en la que se encuentran los criptosellos, si no en TODAS las cadenas registradas en [Dune Analytics](https://dune.com).

## La panoja

Todos sabemos que las criptocosas mueven pasta, con [algunas colecciones llegando a millones de dólares](https://forbes.es/criptomonedas/217739/la-crypto-punk-mania-este-es-el-top-10-de-colecciones-de-nft-de-2022/), pero, ¿cuanto dinero mueven los criptosellos?

De momento no ha habido a penas transferencias, y ninguna de ellas por dinero a través de una casa de subastas, por lo que en ese aspecto no podemos decir si tener un criptosello tiene algún valor.

Sin embargo, podemos estimar cual es el _beneficio_ que le ha reportado a Correos esta estratagema. Cada uno cuesta 15€ y tiene un valor nominal de 10€ (es decir, puedes usarlo para envíos que cuesten hasta 10€), quedando 5€ de sobreprecio para Correos.

Como por el momento se han vendido {{<data/text id="criptosellos-total-tokens2">}} sellos, Correos ha recibido por lo menos {{<data/text id="criptosellos-total-money">}}€ de ingresos con el sobreprecio.

Dependiendo de si el sello acaba siendo usado y en qué producto se use, el beneficio real será mayor.

También habrá muchos sellos que se han comprado pero que aún no se han reclamado en la blockchain, desde luego. Pero yo creo que podemos asumir que, si el usuario no lo ha _minteado_, es porque no le interesa, y el hecho de que sea un criptosello no le ha aportado ningún valor.

Hablando de panoja: aunque no soy un experto en la plataforma de contratación del sector público, estimo que Correos se ha gastado al menos {{<data/text id="criptosellos-correos-contratos" file="contratos.csv">}}€ con {{<data/text id="criptosellos-correos-contratos-cnt">}} contratos para poder lanzar esta colección. Aunque hay que tener en cuenta que parte de ese dinero era destinado a buscar un modelo de negocio y crear el marco de trabajo, por lo que puede amortizarse a lo largo de los años con nuevas colecciones.

> Podéis descargar los datos que he recopilado de las adjudicaciones [aquí](./contratos.csv). Si algo es incorrecto, comentádmelo, por favor.

## Conclusiones

- TODO: Centrar el donut
- TODO: Poner imagen de portada
- TODO: Poner el grafico de NFTs creados a lo largo del tiempo
- TODO: Hacer que se actualicen los datos del post cada X horas (tal vez usando dash r2)
- TODO: Escribir conclusiones
- TODO: Usar frontmatter para hacer SEO y poner metadatos
