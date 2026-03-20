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
    const ip = context.request.headers.get("CF-Connecting-IP") || "unknown"
    const country = context.request.headers.get("CF-IPCountry") || "unknown"
    const result = await context.env.DB.prepare(
      `INSERT INTO soporte
      (nombre,correo,tipo,mensaje,fecha,ip)
      VALUES (?1,?2,?3,?4,?5,?6)`
    )
    .bind(nombre,correo,tipo,mensaje,fecha,ip)
    .run()
    const id = result.meta.last_row_id
    /* EMAIL */
      const apiKey = context.env.RESEND_API_KEY
        const html = `
        <div style="font-family:Arial;background:#f4f4f4;padding:20px">
        <div style="
        max-width:600px;
        margin:auto;
        background:white;
        border-radius:10px;
        overflow:hidden;
        box-shadow:0 0 10px rgba(0,0,0,0.1);
        ">
        <div style="
        background:#222;
        color:white;
        padding:15px;
        text-align:center;
        ">
        <img
        src="https://servitec-pma.pages.dev/assets/img/ServiTec.png"
        style="height:50px"><br>
        Nuevo mensaje de soporte #${id}
        </div>
        <div style="padding:20px">
        <b>ID:</b> ${id}<br><br>
        <b>Nombre:</b> ${nombre}<br><br>
        <b>Correo:</b> ${correo}<br><br>
        <b>Tipo:</b> ${tipo}<br><br>
        <b>Mensaje:</b><br>
        ${mensaje}<br><br>
        <b>Fecha:</b> ${fecha}<br>
        <b>IP:</b> ${ip}<br>
        <b>País:</b> ${country}
        </div>
        <div style="
        background:#eee;
        padding:10px;
        text-align:center;
        font-size:12px;
        ">
        Sistema automático ServiTec
        </div>
        </div>
        </div>
        `
    await fetch(
      "https://api.resend.com/emails",
      {
        method:"POST",
        headers:{
          "Authorization":
            `Bearer ${apiKey}`,
          "Content-Type":
            "application/json"
        },
        body: JSON.stringify({
          from:
            "onboarding@resend.dev",
          to:
            ["didiersanto686@gmail.com"],
          subject:
            `Soporte #${id} | ServiTec`,
          html:
            html
        })
      }
    )
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
