---
title: Sobre los criptosellos de Mortadelo y Filemón
lastmod: 2024-07-24T16:02:07.174Z
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

La realidad es que hay un usuario con muchos más NFTs que el resto: el usuario {{<data/text id="criptosellos-holder-whale-address">}}, que tiene **{{<data/text id="criptosellos-holder-whale-count" >}} criptosellos** en posesión. Por otro lado, la mayoría de usuarios...

TODO:
- La idea es acabar demostrando que estos usuarios, en general, tampoco son criptoentusiastas y que tampoco han sido atraidos al mundo de la filatelia, sino que mas bien han llevado a filatelicos al mundo cripto
- Acabar mencionando cuanto ha pagado correos por estas cosas