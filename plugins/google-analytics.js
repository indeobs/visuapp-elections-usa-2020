/* eslint-disable */

export default ({ app }) => {
  /*
   ** Seulement exécuté côté client et en mode production
   */
  if (process.env.NODE_ENV !== 'production')
    return /*
     ** Inclusion du script Google Analytics
     */
  ;(function (i, s, o, g, r, a, m) {
    i['GoogleAnalyticsObject'] = r
    ;(i[r] =
      i[r] ||
      function () {
        ;(i[r].q = i[r].q || []).push(arguments)
      }),
      (i[r].l = 1 * new Date())
    ;(a = s.createElement(o)), (m = s.getElementsByTagName(o)[0])
    a.async = 1
    a.src = g
    m.parentNode.insertBefore(a, m)
  })(
    window,
    document,
    'script',
    'https://www.googletagmanager.com/gtag/js?id=G-BR60LCHVQR',
    'ga'
  )

  window.dataLayer = window.dataLayer || [];
  function gtag(){dataLayer.push(arguments);}
  gtag('js', new Date());

  gtag('config', 'G-BR60LCHVQR');
}
