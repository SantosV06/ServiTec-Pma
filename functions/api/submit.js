/* =========================================
   SERVITEC PMÁ
   API: /api/submit
   Maneja solicitudes de evaluación técnica
   Cloudflare Pages Function
========================================= */

export async function onRequestPost(context) {

  try {

    /* =========================================
       1. OBTENER DATOS DEL FORMULARIO
    ========================================= */

    const formData = await context.request.formData()

    const nombre = formData.get("nombre")
    const telefono = formData.get("telefono")
    const correo = formData.get("correo")
    const mensaje = formData.get("mensaje")


    /* =========================================
       2. VALIDACIÓN BÁSICA
    ========================================= */

    if(!nombre || !telefono || !correo){
      return new Response(
        JSON.stringify({
          ok:false,
          error:"Faltan campos obligatorios"
        }),
        { status:400 }
      )
    }

    /* validar longitud mínima */

    if(nombre.length < 2){
      return new Response(
        JSON.stringify({
          ok:false,
          error:"Nombre demasiado corto"
        }),
        { status:400 }
      )
    }


    /* =========================================
       3. CREAR OBJETO DE SOLICITUD
    ========================================= */

    const solicitud = {

      nombre: nombre.trim(),

      telefono: telefono.trim(),

      correo: correo.trim(),

      mensaje: mensaje ? mensaje.trim() : "",

      fecha: new Date().toISOString(),

      ip: context.request.headers.get("CF-Connecting-IP") || "desconocida"

    }


    /* =========================================
       4. LOG (para pruebas)
       En producción se guardará en DB
    ========================================= */

    console.log("Nueva solicitud recibida:")
    console.log(solicitud)


    /* =========================================
       5. RESPUESTA AL CLIENTE
    ========================================= */

    return new Response(
      JSON.stringify({
        ok:true,
        message:"Solicitud recibida correctamente"
      }),
      {
        status:200,
        headers:{
          "Content-Type":"application/json"
        }
      }
    )

  } catch(error){

    /* =========================================
       6. MANEJO DE ERRORES
    ========================================= */

    console.error("Error en submit:", error)

    return new Response(
      JSON.stringify({
        ok:false,
        error:"Error interno del servidor"
      }),
      {
        status:500,
        headers:{
          "Content-Type":"application/json"
        }
      }
    )

  }

}