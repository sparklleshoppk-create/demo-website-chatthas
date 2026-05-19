async function checkRedirect() {
  const res = await fetch('https://chatthas-website.vercel.app', { redirect: 'manual' });
  console.log('Status:', res.status);
  console.log('Location:', res.headers.get('location'));
}
checkRedirect();
