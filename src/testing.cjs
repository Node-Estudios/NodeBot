const { Innertube, UniversalCache } = require('youtubei.js');

(async () => {
  const yt = await Innertube.create({
    // required if you wish to use OAuth#cacheCredentials
    // cache: new UniversalCache()
  });

  // 'auth-pending' is fired with the info needed to sign in via OAuth.
  yt.session.on('auth-pending', (data) => {
    console.log(`Go to ${data.verification_url} in your browser and enter code ${data.user_code} to authenticate.`);
  });

  // 'auth' is fired once the authentication is complete
  yt.session.on('auth', ({ credentials }) => {
    console.log('Sign in successful:', credentials);
  });

  yt.session.on('auth-error', ({credentials}) =>{
    console.log('auth failed: ', credentials)
  })

  // 'update-credentials' is fired when the access token expires, if you do not save the updated credentials any subsequent request will fail 
  // yt.session.on('update-credentials', ({ credentials }) => {
  //   console.log('Credentials updated:', credentials);
  // });

  // Attempt to sign in
  await yt.session.signIn()
  //access_token: 'ya29.a0AX9GBdVpZCIlb-UsPJ8QAjR9Yq-EFsCAnoHOdm7VL-sGpBjMF0jlxTnKrvhonzoerREVeRhr73qQAWUntpt_l-z4UqszK8gqdK78YucnPeZUV-a0dJrW_Gga4eUhFWD_OAq4PHAGW3hoNzl-e7bfwV59qQnTaCgYKASUSARISFQHUCsbCZv9UUDr1pIxeZoE9ed4XQg0163',
  //refresh_token: '1//04pEuFM9P1DQuCgYIARAAGAQSNwF-L9IrQqrt3PNPBVPVJmT5TwHxgsWVeeji-9dQSrramKlo70IcH4gukrfsoAsnKtXKodukqSI',
  //expires: 1672940155217
  // await yt.session.signIn({access_token: "ya29.a0AX9GBdVhX6cSKH6T4T-EJMsLSe2M4JRYStg3qsBGhIoxsXGiCqAUz4CKUCWGB3T-CFVL6DEYmJ0aF6Yt5lp8aUgCBBPe1lvznJ3lb8U3WFp9CbdcDGPEp8Nbq5bJ3A_wj6ypLgcoMKdLkBAM0sbtJlQv5QRHaCgYKAfoSARISFQHUCsbC_l8vbMxM_dPuA45KyRz7jg0163",
    //  refresh_token: '1//04nVBRZetc4wdCgYIARAAGAQSNwF-L9Irf65WaRnMVx87vJVj3z7URdIKd99PeM1mlpCg63y2sVHmBP9BBfbCMBL3_Lbghjml50Q', expires: Date.now()});

  // ... do something after sign in

  // You may cache the session for later use
  // If you use this, the next call to signIn won't fire 'auth-pending' instead just 'auth'.
  // await yt.session.oauth.cacheCredentials();
  console.log(await yt.search('pepo'))
  // console.log(await (await yt.music.getHomeFeed()).sections[0].contents)

  // const stream = await yt.download('Q0cGM7C28a4', {type: 'audio', quality: 'best', format: 'mp3' | 'ogg' | 'webp'})
  // stream
})();