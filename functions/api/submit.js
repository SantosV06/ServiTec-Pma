export async function onRequestPost(context){

  try{

    const formData = await context.request.formData()

    const token = formData.get("cf-turnstile-response")

    if(!token){
      return new Response(JSON.stringify({
        ok:false,
        error:"Captcha requerido"
      }),{status:400})
    }

    const verify = await fetch(
      "https://challenges.cloudflare.com/turnstile/v0/siteverify",
      {
        method:"POST",
        headers:{
          "Content-Type":"application/x-www-form-urlencoded"
        },
        body:new URLSearchParams({
          secret: context.env.TURNSTILE_SECRET,
          response: token
        })
      }
    )

    const verifyData = await verify.json()

    if(!verifyData.success){
      return new Response(JSON.stringify({
        ok:false,
        error:"Captcha inválido"
      }),{status:400})
    }

    const nombre = formData.get("nombre")
    const telefono = formData.get("telefono")
    const correo = formData.get("correo")
    const mensaje = formData.get("mensaje")

    const fecha = new Date().toISOString()
    const ip = context.request.headers.get("CF-Connecting-IP")

    await context.env.DB.prepare(
      `INSERT INTO solicitudes
       (nombre,telefono,correo,mensaje,fecha,ip)
       VALUES (?1,?2,?3,?4,?5,?6)`
    )
    .bind(nombre,telefono,correo,mensaje,fecha,ip)
    .run()

    return new Response(JSON.stringify({
      ok:true
    }),{
      headers:{ "Content-Type":"application/json" }
    })

  }catch(err){

    console.error(err)

    return new Response(JSON.stringify({
      ok:false
    }),{
      status:500,
      headers:{ "Content-Type":"application/json" }
    })

  }

}
