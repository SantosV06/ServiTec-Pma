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
