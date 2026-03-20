export async function onRequestPost(context){
  try{
    const formData = await context.request.formData()
    const nombre = formData.get("nombre")
    const telefono = formData.get("telefono")
    const correo = formData.get("correo")
    const mensaje = formData.get("mensaje")
    /* validar campos */
    if(!nombre || !telefono || !correo){
      return new Response(
        JSON.stringify({
          ok:false,
          error:"Campos obligatorios faltantes"
        }),
        {
          status:400,
          headers:{ "Content-Type":"application/json" }
        }
      )
    }
    const fecha = new Date().toISOString()
    const ip = context.request.headers.get("CF-Connecting-IP") || "unknown"
    /* guardar en D1 */
    await context.env.DB.prepare(
      `INSERT INTO solicitudes
       (nombre,telefono,correo,mensaje,fecha,ip)
       VALUES (?1,?2,?3,?4,?5,?6)`
    )
    .bind(nombre,telefono,correo,mensaje,fecha,ip)
    .run()
    /* ENVIAR EMAIL (RESEND) */
    const apiKey = context.env.RESEND_API_KEY
    const html = `
    <h2>Nueva solicitud</h2>
    <b>Nombre:</b> ${nombre} <br>
    <b>Teléfono:</b> ${telefono} <br>
    <b>Correo:</b> ${correo} <br>
    <b>Mensaje:</b> ${mensaje} <br>
    <b>Fecha:</b> ${fecha}
    `
      await fetch("https://api.resend.com/emails",{
        method:"POST",
        headers:{
          "Authorization":`Bearer ${apiKey}`,
          "Content-Type":"application/json"
        },body:JSON.stringify({
          from:"onboarding@resend.dev",
          to:["didiersanto686@gmail.com"],
          subject:"Nueva solicitud ServiTec",
          html:html
        })
      }
    )
    return new Response(
      JSON.stringify({
        ok:true,
        message:"Solicitud guardada"
      }),
      {
        headers:{ "Content-Type":"application/json" }
      }
    )
  }catch(error){
    console.error(error)
    return new Response(
      JSON.stringify({
        ok:false,
        error:"Error interno"
      }),
      {
        status:500,
        headers:{ "Content-Type":"application/json" }
      }
    )
  }
}
