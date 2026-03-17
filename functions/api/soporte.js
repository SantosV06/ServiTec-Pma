export async function onRequestPost(context){

  try{

    const formData = await context.request.formData()

    const nombre = formData.get("nombre")
    const correo = formData.get("correo")
    const tipo = formData.get("tipo")
    const mensaje = formData.get("mensaje")

    if(!nombre || !correo || !mensaje){

      return new Response(JSON.stringify({
        ok:false,
        error:"Campos obligatorios faltantes"
      }),{
        status:400,
        headers:{ "Content-Type":"application/json" }
      })

    }

    const fecha = new Date().toISOString()

    const ip =
      context.request.headers.get("CF-Connecting-IP") || "unknown"

    await context.env.DB.prepare(

      `INSERT INTO soporte
      (nombre,correo,tipo,mensaje,fecha,ip)
      VALUES (?1,?2,?3,?4,?5,?6)`

    )
    .bind(nombre,correo,tipo,mensaje,fecha,ip)
    .run()

    return new Response(JSON.stringify({
      ok:true,
      message:"Mensaje enviado"
    }),{
      headers:{ "Content-Type":"application/json" }
    })

  }catch(err){

    console.error(err)

    return new Response(JSON.stringify({
      ok:false,
      error:"Error interno"
    }),{
      status:500,
      headers:{ "Content-Type":"application/json" }
    })

  }

}
