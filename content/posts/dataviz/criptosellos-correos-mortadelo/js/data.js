import * as d3 from "https://cdn.jsdelivr.net/npm/d3@7/+esm";
import * as Plot from "https://cdn.jsdelivr.net/npm/@observablehq/plot@0.6/+esm";

console.log("Loaded data.js")
console.log("{{ . }}")

function runOnFirstVisible(element, callback) {
  const observer = new IntersectionObserver((es, o) => {
    es.forEach((e) => {
      if (e.isIntersecting) {
        callback(e.target)
        o.unobserve(e.target)
      }
    })
  }, { rootMargin: '300px' })

  observer.observe(element)
}

function getDataUrls(element) {
  const urls = [element?.dataset?.url, element?.dataset?.localUrl]
    .filter(Boolean)
  return [...new Set(urls)]
}

async function loadWithFallback(element, loader) {
  const urls = getDataUrls(element)
  if (urls.length === 0) {
    throw new Error('No data-url configured for element')
  }

  let lastError = null
  for (const url of urls) {
    try {
      return await loader(url)
    } catch (error) {
      lastError = error
      console.warn('Data load failed, trying fallback if available:', url, error)
    }
  }

  throw lastError ?? new Error('All data sources failed')
}

async function loadJson(element) {
  return loadWithFallback(element, async (url) => {
    const response = await fetch(url)
    if (!response.ok) {
      throw new Error(`HTTP ${response.status} for ${url}`)
    }
    return response.json()
  })
}

async function loadCsv(element, row) {
  return loadWithFallback(element, (url) => d3.csv(url, row))
}

function formatEthAddr(addr, i18n) {
  if (addr.startsWith('0x')) {
    return addr.slice(0, 6) + '...' + addr.slice(-4)
  } else if (addr.startsWith('only')) {
    return addr.slice('only'.length) + ' ' + i18n.stampsPerUserShort
  } else {
    return addr
  }
}

document.addEventListener('DOMContentLoaded', () => {
  console.log('DOMContentLoaded')
  const htmlLang = (document.documentElement.lang || '').toLowerCase()
  const isEnglish = htmlLang.startsWith('en')
  const locale = isEnglish ? 'en-US' : 'es-ES'
  const i18n = {
    ofLabel: isEnglish ? 'of' : 'de',
    dateKey: isEnglish ? 'Date' : 'Fecha',
    totalStampsKey: isEnglish ? 'Total crypto stamps' : 'Total criptosellos',
    totalLabel: isEnglish ? 'Total' : 'Total',
    changeLabel: isEnglish ? 'Change' : 'Variacion',
    addressLabel: isEnglish ? 'Address' : 'Dir',
    multipleAddressesLabel: isEnglish ? 'Multiple addresses' : 'Multiples direcciones',
    stampsLabel: isEnglish ? 'stamps' : 'sellos',
    usersLabel: isEnglish ? 'users' : 'usuarios',
    stampsPerUserShort: isEnglish ? 'stamps p.u. (per user)' : 'sellos p.u. (por usuario)',
  }
  // runOnFirstVisible(document.getElementById('criptosellos-last-update'), (e) => {
  //   console.log("Getting data from", e.dataset.url)
  const e = document.getElementById('criptosellos-last-update')
  loadJson(e).then(json => {
    e.innerHTML = (new Date(json['last-update'])).toLocaleString(locale)

    document.getElementById('criptosellos-total-tokens').innerHTML = json['total-tokens']
    document.getElementById('criptosellos-daily-avg').innerHTML = Math.round(json['daily-avg'] * 10) / 10
    document.getElementById('criptosellos-total-holders').innerHTML = json['total-holders']
    document.getElementById('criptosellos-holder-avg').innerHTML = Math.round(json['total-tokens'] / json['total-holders'] * 100) / 100
    document.getElementById('criptosellos-holder-whale-address').innerHTML = '<code>' + json['holders-whale-address'] + '</code>'
    document.getElementById('criptosellos-holder-whale-count').innerHTML = json['holders-whale-cnt']
    document.getElementById('criptosellos-holder-oneortwo-cnt').innerHTML = json['holder-oneortwo-holders-cnt'] + " " + i18n.ofLabel + " " + json['total-holders']
    document.getElementById('criptosellos-holders-had-nfts-avg').innerHTML = Math.round(json['holders-had-nfts-avg'] * 100) + '%'
    document.getElementById('criptosellos-holders-had-nfts-avg-not').innerHTML = 100 - Math.round(json['holders-had-nfts-avg'] * 100) + '%'

    document.getElementById('criptosellos-total-tokens2').innerHTML = json['total-tokens']
    document.getElementById('criptosellos-total-money').innerHTML = json['total-tokens'] * 5
  })
  // })

  runOnFirstVisible(document.getElementById('criptosellos-diario-chart'), async (e) => {
    console.log("Getting data from", e.dataset.url)
    const data = await loadCsv(e, (d) => {
      return {
        [i18n.dateKey]: new Date(d.block_date),
        daily: parseInt(d.Dia ?? d.Day),
        [i18n.totalStampsKey]: parseInt(d.Total),
      }
    })

    const plot = Plot.plot({
      height: 300,
      width: e.offsetWidth,
      y: { grid: true },
      marks: [
        Plot.lineY(data, {
          x: i18n.dateKey,
          y: i18n.totalStampsKey,
        }),
        Plot.tip(data, Plot.pointerX(
          {
            x: i18n.dateKey,
            y: i18n.totalStampsKey,
            title: d => `${d[i18n.dateKey].toLocaleDateString(locale)}\n  ${i18n.totalLabel}: ${d[i18n.totalStampsKey]}\n  ${i18n.changeLabel}: ↑ ${d.daily}`,
          }
        ))
      ]
    })

    e.replaceChildren(plot)
  })

  runOnFirstVisible(document.getElementById('criptosellos-holders-chart'), async (e) => {
    console.log("Getting data from", e.dataset.url)
    const data = await loadCsv(e)
    const width = 500

    const height = Math.min(width, 500)
    const radius = Math.min(width, height) / 2

    const arc = d3.arc()
      .innerRadius(radius * 0.67)
      .outerRadius(radius - 1)

    const pie = d3.pie()
      .padAngle(1 / radius)
      .sort((a, b) => (a.eachCnt > b.eachCnt) && (a.cnt > b.cnt))
      .value(d => d.cnt)

    // const color = d3.scaleOrdinal()
    //   .domain(data.map(d => d.to))
    //   .range(d3.quantize(t => d3.interpolateSpectral(t * 0.8 + 0.1), data.length).reverse())
    const color = d3.scaleOrdinal(d3.schemeDark2)

    const svg = d3.create("svg")
      .attr("width", width)
      .attr("height", height)
      .attr("viewBox", [-width / 2, -height / 2, width, height])
      .attr("style", "max-width: 100%; height: auto;");

    svg.append("g")
      .selectAll()
      .data(pie(data))
      .join("path")
      .attr("fill", d => color(d.data.to))
      .attr("d", arc)
      .append("title")
      .text(d => {
        if (d.data.cnt / d.data.eachCnt == 1) {
          return `${i18n.addressLabel}: ${d.data.to}\n  ${d.data.cnt} ${i18n.stampsLabel}`
        } else {
          return `${i18n.multipleAddressesLabel}\n  ${d.data.eachCnt} ${i18n.stampsPerUserShort}\n  ${d.data.cnt / d.data.eachCnt} ${i18n.usersLabel}`
        }
      });

    svg.append("g")
      .attr("font-family", "sans-serif")
      .attr("font-size", 12)
      .attr("text-anchor", "middle")
      .selectAll()
      .data(pie(data))
      .join("text")
      .attr("transform", d => `translate(${arc.centroid(d)})`)
      .call(text => text.append("tspan")
        .attr("y", "-0.4em")
        .attr("font-weight", "bold")
        .text(d => formatEthAddr(d.data.to, i18n)))
      .call(text => text.filter(d => (d.endAngle - d.startAngle) > 0.25).append("tspan")
        .attr("x", 0)
        .attr("y", "0.7em")
        .attr("fill-opacity", 0.7)
        .text(d => d.data.cnt.toLocaleString(locale)));

    e.replaceChildren(svg.node())
  })

  runOnFirstVisible(document.getElementById('criptosellos-correos-contratos'), async (e) => {
    console.log("Getting data from", e.dataset.url)
    const data = await loadCsv(e)
    const total = Math.round(d3.sum(data, d => d.dinero) * 100) / 100

    e.innerHTML = total.toLocaleString(locale)
    document.getElementById('criptosellos-correos-contratos-cnt').innerHTML = data.length
  })
})
