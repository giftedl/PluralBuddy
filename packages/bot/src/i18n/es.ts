import { emojis } from "@/lib/emojis";
export default {
  INTRODUCTION_MESSAGE: `## Bienvenido/a a PluralBuddy
PluralBuddy es un bot diseñado para cubrir la necesidad de intercambios de pluralidad personalizables y de calidad para servidores y usuarios de Discord.

:track_next: Para empezar, haz clic en el botón Siguiente página abajo para configurar tu sistema.`,
  IMPORT_MESSAGE: `## Configuración de tu sistema
Puedes crear un nuevo sistema que te permitirá crear tus alters y etiquetas por ti mismo/a.
Además, también puedes importar datos desde otro bot como PluralKit.
-# Para importar desde Tupperbox, debido a la falta de datos que proporciona su exportación, debes crear el sistema y luego ejecutar \`{{ prefix }}system import\`.`,
  PAGINATION_NEXT_PAGE: "Siguiente página",
  PAGINATION_FINISH: "Finalizar",
  NO_SERVER_DELETION: "Los alters de PluralBuddy Express deben ser invitados realmente a un servidor para que los mensajes puedan ser eliminados debido a restricciones de Discord. ¡Sin embargo, deberías poder eliminarlo tú mismo haciendo clic derecho!",
  BLOCKED: "Has sido bloqueado/a de **{{ guild }}**. No puedes usar PluralBuddy en este servidor.",
  // Does not need to be translated
  BLOCK_PC: `You have been blocked from **Pridecord**. You cannot use PluralBuddy in this guild.

> **Reason:** {{ libbyReasoning }}
> **Expires:** {{ libbyExpirationDate }}
> -# {{ reply }} Please view the DM from <@1455014942888693792> regarding case \`{{ libbyCaseId }}\`.`,
  PAGINATION_PREVIOUS_PAGE: "Página anterior",
  CREATING_NEW_SYSTEM_HEADER: "## Creando un nuevo sistema",
  ERROR_DISABLED_SYSTEM: "2f – Tu sistema está desactivado. No puedes usar proxy.",
  OPTION_DISABLED: "Esta opción no se puede seleccionar. Está desactivada.",
  TOO_MANY_BLOCKED_ITEMS: "Hay demasiados elementos bloqueados. Solo puedes tener 25 roles bloqueados y 25 canales bloqueados a la vez debido a limitaciones de los modales de Discord.",
  TOO_MANY_MANAGER_ITEMS: "Hay demasiados elementos de administrador. Solo puedes tener 25 roles de administrador a la vez debido a limitaciones de los modales de Discord.",
  CREATING_NEW_SYSTEM_NAME_MESSAGE: `
Los sistemas en PluralBuddy requieren un **nombre de sistema**. Debe tener entre 3 y 20 caracteres de longitud. Los nombres del sistema se mostrarán cuando alguien identifique un mensaje de tu sistema.`,
  CREATING_NEW_SYSTEM_NAME_BUTTON: "Establecer nombre*",
  CREATING_NEW_SYSTEM_NAME_SET: "El nombre es:",
  CREATING_NEW_SYSTEM_TAG_BUTTON: "Establecer etiqueta del sistema*",
  CREATING_NEW_SYSTEM_TAG_SET: "La etiqueta del sistema es:",
  CREATING_NEW_SYSTEM_TAG_MESSAGE: `
Este servidor requiere una **etiqueta de sistema** para los sistemas que envían mensajes proxy aquí. Para poder crear un sistema aquí, debes tener una etiqueta de sistema.`,
  CREATING_NEW_SYSTEM_PRIVACY_BUTTON: "Establecer valores de privacidad",
  CREATING_NEW_SYSTEM_PRIVACY_MESSAGE: `
Los sistemas pueden tener **valores de privacidad**, que son ajustes que describen quién puede ver cada parte de tu sistema. Por defecto, tu sistema es completamente privado, salvo la automoderación del servidor y los mensajes que envía tu sistema. Sin embargo, cambiarlos modificará dichos valores.`,
  CREATING_NEW_SYSTEM_PRIVACY_SET: "Los valores de privacidad pública son:",
  CREATING_NEW_SYSTEM_PRIVACY_FORM_DESC: "Selecciona los valores de privacidad que deseas que sean públicos.",
  CREATING_NEW_SYSTEM_SUCCESS: `¡Sistema creado con éxito!
### Próximos pasos
> - Para crear un nuevo alter, intenta usar %command1%
> - Para crear una nueva etiqueta, intenta usar %command2%`,
  SETUP_ERROR_SYSTEM_ALREADY_EXISTS: "2b – No puedes configurar un nuevo sistema si ya existe un sistema vinculado a tu cuenta.",
  SETUP_ERROR_SYSTEM_ALREADY_EXISTS_BTN: "Eliminar sistema y configurar de nuevo",
  ERROR_PAGINATION_TOO_OLD: "2g – Ese componente de paginación de alters es demasiado antiguo, no puedes continuar. Por favor, haz clic en la pestaña \"Alters\" en la parte superior del mensaje para reiniciar la paginación.",
  ERROR_TAG_PAGINATION_TOO_OLD: "2h – Ese componente de paginación de etiquetas es demasiado antiguo, no puedes continuar. Por favor, haz clic en la pestaña \"Etiquetas\" en la parte superior del mensaje para reiniciar la paginación.",
  ERROR_ASSIGN_PAGINATION_TOO_OLD: "2i – Ese componente de paginación es demasiado antiguo, no puedes continuar. Por favor, vuelve atrás y haz clic en el botón Asignar de nuevo para que vuelva a funcionar.",
  ERROR_NO_ALTERS: "2w – ¡No tienes alters! ¡Crea uno a continuación!",
  ERROR_NO_TAGS: "2x – ¡No tienes etiquetas! ¡Crea una a continuación!",
  PK_IMPORT_START: "## Importación de PluralKit",
  SP_IMPORT_START: `## Importación de Simply Plural
	
SimplyPlural ha sido descontinuado.`,
  PAGE_NEW_SYS_TEXT: "-# Página 3/3 · Algunos campos no se han completado. · * Obligatorio",
  PAGE_NEW_SYS_TEXT_FILLED: "-# Página 3/3 · * Obligatorio",
  IMPORT_PLURALKIT_DESCRIPTION: "Importar desde PluralKit",
  IMPORT_TUPPERBOX_DESCRIPTION: "Importar desde TupperBox",
  IMPORT_PLURALBUDDY_DESCRIPTION: "Importar desde PluralBuddy",
  IMPORT_SIMPLYPLURAL_DESCRIPTION: "Importar desde SimplyPlural",
  IMPORT_SOURCE_DESCRIPTION: "Fuente de importación",
  IMPORT_TOKEN_DESCRIPTION: "Token de SimplyPlural",
  CREATE_NEW_SYS_DESCRIPTION: "Crear nuevo sistema",
  PLURALBUDDY_IMPORT_ERROR_TOO_LARGE: "2j – Los archivos a importar no pueden superar los 2MB. Por favor, contacta con soporte si realmente estás intentando importar un sistema superior a 2MB.",
  ERROR_ATTACHMENT_TOO_LARGE: "2j – Los archivos adjuntos para banners o imágenes de perfil no pueden superar los 1MB.",
  CREATE_NEW_ALTER_DESCRIPTION: "Crear nuevo alter",
  CREATE_NEW_TAG_DESCRIPTION: "Crear nueva etiqueta",
  PLURALBUDDY_IMPORT_ERROR_INVALID_JSON: "2k – El archivo que importaste no es un JSON válido.",
  ERROR_INTERACTION_TOO_OLD: "2l – Ya no se realiza el seguimiento de esta interacción. (¿has esperado demasiado?)",
  ERROR_SYSTEM_DOESNT_EXIST: "2m – No se puede concluir esta operación porque no existe ningún sistema sobre el que operar.",
  ERROR_ALTER_DOESNT_EXIST: "2n – No se puede concluir esta operación porque no existe el alter o no hay ningún sistema asociado al usuario que realizó la solicitud.",
  ERROR_ALTER_DOESNT_EXIST_SUGGESTION: "2n – No se pudo encontrar ese alter. ¿Quisiste decir `%suggestion%`?",
  ERROR_TAG_DOESNT_EXIST: "2o – No se puede concluir esta operación porque no existe la etiqueta o no hay ningún sistema asociado al usuario que realizó la solicitud.",
  CREATING_NEW_SYSTEM_FORM_TITLE: "Establecer detalles del sistema",
  EDIT_SYSTEM_FORM_TITLE: "Editando sistema",
  SYSTEM_PRONOUNS_FORM_LABEL: "Pronombres",
  SYSTEM_DESCRIPTION_FORM_LABEL: "Descripción",
  SYSTEM_SYSTEM_TAG_FORM_LABEL: "Etiqueta del sistema",
  ALTER_SUCCESS_PRONOUNS: "Se han establecido con éxito los pronombres de @%alter% a %new%.",
  ALTER_SUCCESS_PRIVACY: "Se han establecido con éxito los valores de privacidad pública de @%alter% a %new% (%number% valores en total).",
  ALTER_SUCCESS_DESC: "Se ha establecido con éxito la descripción de @%alter%.",
  TAG_SUCCESS_ORDER: "Se ha establecido correctamente la cadena de orden para @%tag%.",
  PAGINATION_TITLE: "Página",
  WAITING: "Cargando...",
  WAITING_LONG_TERM: "Cargando... Esto tomará un momento. Por favor, espera.",
  SUCCESSFULLY_IMPORTED: "Se han importado con éxito %alter_count% alter(s) para %system_name%.",
  CREATING_NEW_PT_FORM_TITLE: "Nueva etiqueta proxy",
  CREATING_NEW_PT_FORM_DESC: `PluralBuddy utiliza un formato de etiquetas proxy similar al de otros bots de pluralidad.
> - **Por ejemplo:** \`texto :bob\` sería válido y enviará mensajes proxy que terminen en \`:bob\`.
> - Opcionalmente, puedes mostrar estas etiquetas activando la opción "Mostrar etiquetas proxy" del sistema en la segunda página.`,
  CREATING_NEW_PT_FORM_LABEL: "Etiqueta proxy",
  CREATING_NEW_PT_ERROR: "2p – El formato no es correcto. Recuerda que debes tener un prefijo y un sufijo separados por `texto`.",
  CREATING_NEW_PT_TOO_MANY_CHARS: "2y – Hay demasiados caracteres en el prefijo o en el sufijo. Recuerda que solo puedes tener hasta 20 caracteres para el prefijo y 20 para el sufijo.",
  SUCCESSFULLY_NEW_PT: "¡Se ha creado con éxito una nueva etiqueta proxy!",
  PLURALBUDDY_IMPORT_DESC: "Copia y pega los datos JSON exportados a continuación:",
  PLURALBUDDY_IMPORT_ERROR: "2q – Ocurrió un error al procesar los datos:\n\n```\n%zod_errors%\n```",
  PLURALBUDDY_OPTIONS_ERROR: "2r – Ocurrió un error al evaluar los argumentos de ese comando:\n\n\\`\\`\\`\n%options_errors%\n\\`\\`\\`",
  CREATE_NEW_ALTER_DONE: "Se ha creado con éxito un nuevo alter en tu sistema. Usa `%prefix%alter %alter_id%` para más detalles.",
  CREATE_NEW_ALTER_ADD: "Se realizaron las siguientes operaciones adicionales en este alter:",
  CREATE_NEW_ALTER_DESC: "Descripción asignada: {{ description }}",
  CREATE_NEW_ALTER_PRONOUNS: "Pronombres asignados: **{{ pronouns }}**",
  CREATE_NEW_ALTER_NOW: "Usando autoproxy con este alter **ahora mismo**.",
  CREATE_NEW_ALTER_ASSIGN: "Este alter ha sido asignado a **{{ tag }}**.",
  NO_SUCH_TAG_CANT_ASSIGN: "No se puede asignar este alter a la etiqueta especificada porque no existe.",
  CREATE_NEW_ALTER_DISPLAY_NAME: "Nombre para mostrar asignado: **{{ dn }}**",
  CREATE_NEW_TAG_DONE: "Se ha creado con éxito %color_emoji% **%tag_name%** en tu sistema. Usa %command% para más detalles.",
  TAG_SPACE_WARNING: "Dado que esta etiqueta contiene **espacios**, algunos comandos pueden requerir que entrecomilles el nombre para mostrar. También puedes usar directamente los comandos de aplicación.",
  TAG_ALREADY_EXISTS: "Ya tienes una etiqueta llamada **%display%** en tu sistema.",
  CONFIRMATION_SYSTEM_DELETION: "# :warning: __ESTÁS A PUNTO DE ELIMINAR TU SISTEMA__ :warning:\n**Esta acción NO SE PUEDE deshacer por el soporte de PluralBuddy**, ni por ti mismo/a de ninguna forma en el futuro. __Esto eliminará TODOS los datos del sistema, incluyendo etiquetas, alters y otros elementos de tu sistema__.\n\n> **Consejo:** Si solo necesitas desactivar el proxy para todos los alters, puede ser mejor **desactivar** el sistema en su lugar.",
  CONFIRMATION_SYSTEM_DELETION_PRIVACY: "-# De acuerdo con la [Política de privacidad de PluralBuddy](https://gftl.fyi/privacy), esta acción eliminará todos los datos relacionados con tu sistema, **excepto** los banners e imágenes de perfil del sistema. Estos se pueden eliminar usando la bandera `media-included` de %command%.",
  CONFIRMATION_SYSTEM_DELETION_BTN: "Entiendo que esta es una acción permanente, continuar",
  BACK_TO_SAFETY_BTN: "No, volver a un lugar seguro",
  CONFIRMATION_ALTER_DELETION: "¿Estás seguro/a de que deseas eliminar a @%alter%? **Esta acción no se puede deshacer.**",
  SYSTEM_DELETION_FINISHED: "Se ha eliminado tu sistema con éxito. \n-# A continuación también se incluye una copia de seguimiento de la exportación de tu sistema.",
  OPTED_OUT_OF_DMS: "Has desactivado con éxito los mensajes directos (DM). Ya no recibirás DMs para operaciones relacionadas con el sistema.\n\n> **Por qué no se recomienda:** Desactivar los DMs de operaciones elimina una salvaguarda contra aplicaciones OAuth potencialmente peligrosas que realicen cambios pequeños pero significativos en tu sistema. Desactivarlos removerá por completo esta protección, lo cual podría no ser lo deseado. El soporte de PluralBuddy podría no ser capaz de recuperar datos destruidos por aplicaciones OAuth.",
  OPTED_IN_OF_DMS: "Has vuelto a activar los mensajes directos (DM) con éxito.",
  SYSTEM_DELETION_MEDIA_FINISHED: "Se ha eliminado con éxito tu sistema **y los archivos multimedia de tu sistema**. \n-# Si tienes los DMs abiertos, también se te ha enviado una copia de la exportación de tu sistema.",
  SYSTEM_DELETION_DM: "Aquí tienes los datos de exportación debido a la eliminación del %time%:",
  ALTER_DELETION_FINISHED: "Se ha eliminado ese alter con éxito.",
  ALTER_SERVER_DN_FORM_LABEL: "Nombre para mostrar en el servidor",
  SYSTEM_EXPORT_FINISHED: "Se ha exportado tu sistema con éxito. Debería estar visible en el mensaje a continuación.",
  SYSTEM_EXPORT_DM: "Aquí están tus datos de exportación solicitados:",
  PRIVACY_VISIBILITY: "Visibilidad",
  PRIVACY_NAME: "Privacidad del nombre para mostrar",
  PRIVACY_USERNAME: "Privacidad del nombre de usuario",
  PRIVACY_DISPLAY_TAG: "Privacidad de la etiqueta visible",
  PRIVACY_DESCRIPTION: "Privacidad de la descripción",
  PRIVACY_COLOR: "Privacidad del color",
  PRIVACY_AVATAR: "Privacidad del avatar",
  PRIVACY_BANNER: "Privacidad del banner",
  PRIVACY_MESSAGE_COUNT: "Privacidad del recuento de mensajes",
  PRIVACY_PRONOUNS: "Privacidad de los pronombres",
  PRIVACY_ALTERS: "Privacidad de los alters",
  PRIVACY_TAGS: "Privacidad de las etiquetas",
  INVISIBLE_ALTER: "No puedes ver este alter debido a su configuración de privacidad.",
  INVISIBLE_TAG: "No puedes ver esta etiqueta debido a su configuración de privacidad.",
  SYSTEM_NAME_FORM_LABEL: "Nombre del sistema",
  SYSTEM_PRIVACY_FORM_LABEL: "Privacidad del sistema",
  SYSTEM_TAG_FORM_LABEL: "Etiqueta del sistema",
  SYSTEM_NICKNAME_FORM_LABEL: "Formato de apodo del sistema",
  SYSTEM_NICKNAME_FORM_DESC: "Donde \"%username%\" es el nombre de usuario de tu alter, y \"%display%\" es el nombre para mostrar de tu alter",
  SYSTEM_PRIVACY_INFO: `-# Por defecto, todo tu sistema de PluralBuddy es completamente privado. Esto significa que nadie puede ver información sobre tu sistema salvo que uses proxy o un desarrollador lo revise (muy poco probable).
-# - **Qué son las opciones de privacidad:** Las opciones de privacidad son elementos que puedes elegir hacer públicos en tu sistema. Esto te otorga un control detallado sobre qué es público y qué es privado.`,
  ALTER_PROXY_TAGS: "`## Etiquetas Proxy - @%alter%\nLas etiquetas proxy son la forma en que tu alter *se presenta* según el contenido de tu mensaje. Puedes crear varias de estas, con un máximo de 20 caracteres para el prefijo/sufijo de cada descriptor.",
  ALTER_FORM_TITLE: "Editando alter",
  ALTER_GENERAL: "## %general% Configuración general - @%alter%\nLos alters son partes de tu sistema. Aquí puedes configurar ciertos valores de tu alter.",
  ALTER_SET_USERNAME: "Establecer nombre de usuario del alter",
  ALTER_SET_DISPLAY: "Establecer nombre para mostrar",
  ALTER_SET_SERVER_NAME: "Establecer nombre para mostrar en el servidor",
  ALTER_SET_SERVER_NAME_DESC: `Establecer este valor cambiará el nombre para mostrar de este alter cuando esté al frente en %server%.
-# Tu nombre en %server% es: %name%`,
  ALTER_SET_USERNAME_DESC: "Los nombres de usuario de los alters no pueden contener espacios y deben tener menos de 20 caracteres. Se utilizan para identificar a tu sistema en los comandos.",
  ALTER_SET_USERNAME_SPACES: "No se permiten espacios, `@`, `` ni `/` en los nombres de usuario.",
  ALTER_INFORMATION: `¡Represéntate sabiamente! PluralBuddy utiliza un sistema de _alters_, que son la base de cada miembro individual que puedas ser.
PluralBuddy usa un sistema de **nombre de usuario/nombre para mostrar**.

## Sistema de nombre de usuario/nombre para mostrar:
> **Tu nombre de usuario:** es como representas a tu alter en los comandos y la _única_ forma de hacerlo. ¡Asegúrate de recordarlo! (Similar a las ID de alter en otros bots)
> **Tu nombre para mostrar:** es cómo se representa a tu alter en webhooks y públicamente. ¡Idealmente puedes colocar aquí los símbolos o caracteres especiales que quieras!
 
-# ¡Ambos valores se pueden cambiar en cualquier momento! Solo vuelve aquí con \`pb;edit-alter config <username>\`.
-# Los nombres de usuario **no** pueden contener @ ni barras inclinadas.
-# Desplázate hacia abajo para ver el resto de este modal.`,
  ALTER_AFTER: `-# 🎀 ¡Buen trabajo! ¡Tu alter es impresionante!`,
  ALTER_DISPLAY_NAME_FORM_LABEL: "Nombre para mostrar",
  ALTER_SEARCH_STRING_FORM_LABEL: "Cadena de búsqueda (máx. 4 caracteres)",
  ALTER_SET_PRONOUNS: "Establecer pronombres",
  ALTER_SET_DESCRIPTION: "Establecer descripción",
  ALTER_SET_ORDER_STRING: "Establecer cadena de pedido",
  ALTER_SET_PFP: "Establecer foto de perfil",
  ALTER_SET_PFP_SE: "Es específico de un servidor",
  ALTER_SET_PFP_SE_DESC: "Esta foto de perfil solo se utilizará específicamente en este servidor.",
  ALTER_SET_TAG: "Establecer etiqueta del sistema",
  ALTER_SET_BANNER: "Establecer banner",
  INVALID_URL: "Esta no es una URL válida. Asegúrate de no envolver tu URL entre `<` o `>`",
  ALTER_SET_PRIVACY: "Establecer privacidad",
  ERROR_INVALID_ATTACHMENT_TYPE: "2s – El archivo adjunto que subiste no es una imagen.",
  ERROR_INVALID_COLOR: "2t – El color ingresado no es un código hexadecimal válido.",
  ERROR_INVALID_NUMBER: "2t – El número ingresado no es un decimal válido.",
  SP_ERROR: "Ocurrió un error al obtener datos de tu sistema de Simply Plural. ¿Era el token correcto? ¿Le otorgaste los permisos adecuados?",
  TAG_GENERAL: "## %general% Configuración general - %tag%\nLas etiquetas son grupos específicos de los que tu alter puede formar parte. Ciertos valores de tu etiqueta se pueden configurar aquí.",
  TAG_SET_DISPLAY_NAME_DESC: "Los nombres para mostrar de las etiquetas son su única forma de identificación. Deben tener menos de 100 caracteres.",
  TAG_SET_COLOR_DESC: "Hay 17 colores diferentes que puedes elegir para tu etiqueta, cada uno con un icono de color único para distinguirlos.",
  TAG_SET_PRIVACY_DESC: "Por defecto, todos los valores de las etiquetas son privados. Usa el botón para configurar los valores públicos.",
  TAG_FORM_TITLE: "Editando etiqueta",
  TAG_SET_COLOR: "Establecer color de la etiqueta",
  TAG_COLOR_FORM_LABEL: "Color de la etiqueta",
  TAG_SET_PRIVACY: "Establecer privacidad de la etiqueta",
  TAG_PRIVACY_FORM_LABEL: "Privacidad de la etiqueta",
  TAG_PRIVACY_FORM_DESC: "Selecciona todos los valores de privacidad públicos.",
  TAG_COLOR_red: "rojo",
  TAG_COLOR_orange: "naranja",
  TAG_COLOR_amber: "ámbar",
  TAG_COLOR_yellow: "amarillo",
  TAG_COLOR_lime: "lima",
  TAG_COLOR_green: "verde",
  TAG_COLOR_emerald: "esmeralda",
  TAG_COLOR_teal: "verde azulado",
  TAG_COLOR_cyan: "cian",
  TAG_COLOR_sky: "celeste",
  TAG_COLOR_blue: "azul",
  TAG_COLOR_indigo: "índigo",
  TAG_COLOR_violet: "violeta",
  TAG_COLOR_purple: "púrpura",
  TAG_COLOR_fuchsia: "fucsia",
  TAG_COLOR_pink: "rosa",
  TAG_COLOR_rose: "rosa oscuro",
  NO_GCP_SE: "No puedes subir archivos adjuntos directamente para recursos específicos de un servidor. Debes usar una URL directa debido a razones técnicas.",
  WAITING_INDEXING: "PluralBuddy está intentando procesar tu sistema. **Esto puede tomar un tiempo.**\n-# **Estado actual:** {{ percentage }} indexado.",
  TOO_MANY_ALTERS: "Hay demasiados alters en tu sistema de PluralBuddy (2000 alters). Por favor, contacta con soporte si crees que esto es un error.",
  TOO_MANY_TAGS: "Hay demasiadas etiquetas en tu sistema de PluralBuddy (500 etiquetas). Por favor, contacta con soporte si crees que esto es un error.",
  SEARCH_FORM_TITLE: "Buscando recursos",
  SEARCH_QUERY: "Consulta de búsqueda",
  SEARCH_QUERY_VALUE: "Valor de la búsqueda",
  SEARCH_QUERY_VALUE_DESC: "Puedes elegir consultar diferentes valores.",
  SEARCH_QUERY_DISPLAY_NAME: "Nombre para mostrar",
  SEARCH_QUERY_USERNAME: "Nombre de usuario",
  SEARCH_REG_EXPRESSIONS: "Puedes usar expresiones regulares aquí.",
  DISABLED_SYSTEM: "Se ha desactivado tu sistema con éxito. **No** podrás usar proxy ya que todo tu sistema ha sido **desactivado**.",
  ENABLED_SYSTEM: "Se ha activado tu sistema con éxito. Podrás usar proxy ya que todo tu sistema ha sido **activado**.",
  NOT_IN_LATCH: "No estás en modo fijado (latch).",
  ALTER_SET_COLOR: "Establecer color del alter",
  DELETE_ALTER: "Eliminar alter",
  ALTER_SET_MODE: "Establecer modo proxy",
  ALTER_SET_MODE_DESC: `Los modos proxy describen cómo se envía el mensaje proxy del alter. Hay tres métodos principales:
> - *Apodo*: Tu apodo se ajusta según el nombre para mostrar de este alter y el formato de apodos del sistema. Requiere el permiso "Cambiar apodo" para funcionar.
> - *Webhooks*: Se crea un webhook con los datos de tu alter y sistema que reemplazará tu mensaje. Similar a bots como PluralKit y Tupperbox. Modo por defecto.
> - *Ambos*: Cambia el apodo y también envía un webhook según el alter.`,
  ALTER_SET_PRIVACY_DESC: `Por defecto, este alter es completamente privado, salvo por la automoderación del servidor y si usas comandos públicamente. 
(con \`-public\` al final) Configurar estos valores le indica a PluralBuddy qué mostrar a otras personas.`,
  ALTER_DELETE: "Eliminar alter",
  SYSTEM_ADVANCED_IMPORT: "Se realizó con éxito una operación de importación avanzada. **{{ alter-count }}** alter(s) y **{{ tag-count }}** etiqueta(s) fueron afectados en esta importación.",
  ALTER_DELETE_DESC: "Eliminar un alter lo removerá por completo del sistema sin opción de deshacer.",
  MONGO_REGEX_ERROR: "Esta no es una expresión regular válida. Si estás usando ( o ) o *, intenta agregar dos barras invertidas al principio.",
  PFP_SUCCESS: "Se actualizó con éxito la foto de perfil para @%alter%.",
  BANNER_SUCCESS: "Se actualizó con éxito el banner para @%alter%.",
  NOT_A_CATEGORY: "Esto no es una categoría.",
  RENAME_SUCCESS: "Se actualizó con éxito el nombre de usuario de @%alter%.",
  TAG_RENAME_SUCCESS: "Se actualizó con éxito el nombre para mostrar de %tag%.",
  DN_SUCCESS: "Se actualizó con éxito el nombre para mostrar de @%alter% a %new-display%.",
  DN_SUCCESS_SS: "Se actualizó con éxito el nombre para mostrar de @%alter% a %new-display% **en %server%**.",
  COLOR_SUCCESS: "Se actualizó con éxito el color de @%alter%.",
  ERROR_MANUAL_PROXY: "2u – Ocurrió un error al enviar el proxy manualmente. Por favor, inténtalo de nuevo más tarde.",
  SUCCESS_PROXY: "¡[Tu mensaje](<%message-link%>) ha sido enviado!",
  CONTENT_ERROR_PROXY: "2v – Debes incluir texto o un archivo adjunto para enviar un proxy.",
  ERROR_USER_BLOCKED: "2a – Este usuario tiene bloqueado el uso de PluralBuddy.",
  OPERATION_HEADER: "Transcripción de la operación:",
  OPERATION_DISCORD: "%clock% Expira en 30 minutos • %discord% Discord",
  OPERATION_WEB: "%clock% Expira en 30 minutos • %web% Web (vía Exchange)",
  OPERATION_WEB_NEXT: "%clock% Expira en 30 minutos • %web% Web (vía Next)",
  SERVER_TOO_BIG: "Este servidor es demasiado grande para usar el comando /proxy, ya que está desactivado por motivos de seguridad en servidores con más de 30 miembros. Por favor, usa el proxy automático en su lugar.",
  OPERATION_DISCORD_AP: "Cambiado en %server_name% (`%server_id%`) • %discord% Discord",
  CLEARED_LATCH: "Se ha limpiado con éxito el **alter fijado** en %server_name%.",
  NO_PERMISSIONS_PROXY: "No puedo enviar mensajes proxy aquí porque no tengo los permisos `Gestionar Webhooks` y `Gestionar Mensajes` en este canal.",
  NICKNAME_MANUAL_PROXY: "No puedes enviar proxy aquí porque el alter especificado utiliza el modo proxy Apodo, y no puedes enviar un mensaje normal al usar el comando de proxy manual. Por favor, usa el proxy automático.",
  OPERATION_ID: "ID de operación: %id%",
  OPERATION_CHANGE_NAME: "Nombre del sistema cambiado a `%name%`.",
  OPERATION_CHANGE_NICKNAME_FORMAT: "Formato de apodo cambiado a `%format%`.",
  OPERATION_CHANGE_SE_TAG: "Etiqueta específica del servidor en %server% cambiada a `%tag%`.",
  OPERATION_CHANGE_DISABLED: "Sistema desactivado",
  OPERATION_CHANGE_ENABLED: "Sistema activado",
  OPERATION_CHANGE_PRIVACY: "Valores de privacidad del sistema establecidos en %privacy%.",
  OPERATION_UNDO_SUCCESS: "Se actualizaron con éxito %value-count% valor(es) como resultado de deshacer la acción.",
  NEW_ROLE_PREF: "Creando preferencia de rol...",
  ROLE_USAGE: "Rol",
  UNABLE_TO_BE_FUNNY: "No tienes permitido usar los comandos divertidos.",
  DISABLED_DM_REPLIES: "Se han desactivado las respuestas por DM. Usa `pb;nudge-preferences` para volver a activarlas.",
  ABOUT_PB: `-# **INFORMACIÓN DE DESARROLLO**
> PluralBuddy Versión %version% · \`%branch%\`

-# **ACERCA DE PLURALBUDDY**
> PluralBuddy es una herramienta de accesibilidad para sistemas, que permite a sus *alters* utilizar pseudocuentas como webhooks para representar a un miembro determinado.
> Este bot fue creado como una alternativa más rápida y controlable a otros bots plurales.
> Para comenzar a usar PluralBuddy, usa %command%.

-# **CRÉDITOS**
**Programado con :heart_hands: por @giftedly**
-# Desarrolló la mayor parte de PluralBuddy

**Contribuciones de código abierto** - [PluralBuddy tiene licencia MIT](https://github.com/giftedl/PluralBuddy/blob/main/LICENSE)
-# Bot: [@LTappleseed](https://github.com/LTappleseed) (@causticdisco)
-# Documentación: [@Cosmic-Foxes](https://github.com/Cosmic-Foxes) (@cosmic.rainbow.), [@Stjernesys](https://github.com/Stjernesys) (@thatskymaridelrosynthia)

**Traducido en Crowdin**
-# 🇩🇪 Traducciones al alemán por @mira.mizuki (gracias, amigo/a)

-# **ENLACES**
> -# %github% [GitHub](https://github.com) · %docs% [Documentación](https://pb.giftedly.dev)
> -# [Términos de servicio](<https://pb.giftedly.dev/docs/policies/terms>) · [Política de privacidad](<https://pb.giftedly.dev/docs/policies/privacy>)`,
  TAG_ASSIGN_ALTER: "Asignar etiqueta",
  SET_AUTO_PROXY_SRV: "Se ha establecido el modo de proxy automático a **%mode%** para tu sistema en **%server_name%**.",
  SET_AUTO_PROXY_GLOBAL: "Se ha establecido el modo de proxy automático a **%mode%** para tu sistema en todas partes.",
  SET_AUTO_PROXY_CUSTOM: "Se ha transferido el control del modo proxy a **%app%** en **%server_name%**. **%app%** podrá controlar quién está al frente hasta que desactives este modo.",
  SET_AUTO_PROXY_CUSTOM_GLOBAL: "Se ha transferido el control del modo proxy a **%app%** en todas partes. **%app%** podrá controlar quién está al frente hasta que desactives este modo.",
  SET_AUTO_PROXY_DMS: "Se ha establecido el modo proxy a **%mode%** para tu sistema en ese servidor.",
  TAG_ALREADY_ASSIGNED: "**%tag%** ya ha sido asignada a **@%alter%.",
  ASSIGNED_TAG: "**%tag%** se ha asignado con éxito a **@%alter%**.",
  FORBIDDEN: "No tienes permiso en este servidor para realizar esta acción.",
  ERROR_FAILED_TO_UPLOAD_TO_GCP: "2d – Error al subir la imagen a Google Cloud Platform. Por favor, inténtalo de nuevo más tarde.",
  DN_ERROR_SE: "2e – No puedes usar este comando en mensajes directos.",
  SYSTEM_SET_NAME: "Se ha cambiado con éxito el nombre de tu sistema a %name%",
  SYSTEM_SET_LATCH_DELAY: "Se ha cambiado con éxito el tiempo de retención a %delay%. Los alters fijados se limpiarán tras ese periodo.",
  SYSTEM_SET_PRONOUNS: "Se han cambiado con éxito los pronombres de tu sistema a %pronouns%",
  SYSTEM_SET_SYSTEM_TAG: "Se ha cambiado con éxito la etiqueta de tu sistema a %tag%",
  OPERATION_SYSTEM_SET_SYSTEM_TAG: "Se cambió la etiqueta de tu sistema a %tag%",
  OPERATION_AVATAR: "Avatar del sistema actualizado a una **[nueva imagen](<%link%>)**.",
  OPERATION_AVATAR_UNDEFINED: "Avatar del sistema restablecido",
  OPERATION_BANNER: "Banner del sistema actualizado a una **[nueva imagen](<%link%>)**.",
  OPERATION_BANNER_UNDEFINED: "Banner del sistema restablecido",
  OPERATION_DESCRIPTION: "Descripción del sistema cambiada a:\n > %description%",
  OPERATION_PRONOUNS: "Pronombres del sistema cambiados a %pronouns%.",
  OPERATION_LATCH_DELAY: "Tiempo de retención del modo fijado cambiado a %delay%.",
  OPERATION_FALLBACK: "Se cambió `%property%` a `%value%`",
  OPERATION_SYSTEM_TOGGLE_PROXY_TAGS: "Se alternó la visibilidad de etiquetas proxy en el sistema.",
  OPERATION_SYSTEM_TOGGLE_PRONOUNS: "Se alternó la visibilidad de pronombres en el sistema.",
  OPERATION_SYSTEM_TOGGLE_TYPING_STATUS: "Se ha cambiado el estado de escritura en el sistema.",
  EDIT_MESSAGE: "Editando mensaje",
  MESSAGE_CONTENTS: "Nuevo contenido del mensaje",
  BLOCKLIST_USER: "ID de usuario a bloquear",
  NUDGE_BLOCKLIST: "Lista de bloqueos para toques (nudges)",
  SUCCESSFULLY_REMOVED_MESSAGE: "Se eliminó ese mensaje con éxito.",
  SUCCESSFULLY_EDITED_MESSAGE: "Se editó con éxito [ese mensaje](<%message%>).",
  NUDGE_SNOOZE: "Silenciar toques permanentemente",
  BLOCK_SNOOZE: "Bloquear a este usuario para que no te dé toques",
  ERROR_OWN_MESSAGE: "2c – Este mensaje no te pertenece o no fue enviado por PluralBuddy.",
  NOT_RECENT_ENOUGH: "2z – No tienes un mensaje lo suficientemente reciente en este canal __**o**__ el mensaje al que respondiste ya no es válido.",
  DISABLE_NUDGING_DONE: "Has desactivado los toques para ti correctamente.",
  USER_CANNOT_BE_NUDGED: "2aa – A este usuario no se le pueden dar toques.",
  USER_ALREADY_BLOCKED: "2ab – Este usuario ya ha sido bloqueado.",
  USER_NOT_BLOCKED: "2ac – Este usuario aún no ha sido bloqueado.",
  SUCCESSFULLY_BLOCKED: "Se bloqueó a ese usuario con éxito.",
  MESSAGE_NOT_MINE: "2af – Este mensaje no es mío.",
  DATA_DOESNT_EXIST: "2ae – El alter o sistema asociado al mensaje ya no existe. (?)",
  INSUFFICIENT_DATA_SIZE: "2ad – No hay una cantidad suficiente de recursos en tu contexto de usuario para continuar con esta operación.",
  INSUFFICIENT_USER_PERMISSIONS: "2ag – No tienes permiso para editar esta información.",
  SUCCESS_CHANGED_SERVER_PREFIXES: "Este servidor ahora tiene los siguientes prefijos: \n%prefixes%",
  SUCCESS_ADD_ITEM_BLOCKED: "%item% ha sido bloqueado con éxito.",
  SUCCESS_REMOVE_ITEM_BLOCKED: "%item% ha sido desbloqueado con éxito.",
  SUCCESS_CHANGED_SERVER_BLOCKS: "Este servidor ahora tiene la siguiente configuración de bloqueos: \n%block_items%",
  PREFIX_ALREADY_EXISTS: "Ese prefijo ya existe o hay un duplicado en la lista.",
  BLOCK_ALREADY_EXISTS: "Ese rol o canal ya está bloqueado.",
  SUCCESS_ADD_MANAGER_ROLE: "%item% ha sido añadido a la lista de roles de administrador con éxito.",
  SUCCESS_CHANGED_MANAGER_BLOCKS: "Este servidor ahora tiene la siguiente configuración de roles de administrador: \n%manager_roles%",
  LATCH_DELAY_INVALID: "Los tiempos de retención no pueden ser mayores a 10 horas ni ser un valor inválido.",
  MANAGER_ALREADY_EXISTS: "Ese rol de administrador ya está en la lista.",
  SUCCESS_REMOVE_MANAGER_ROLE: "%item% ha sido eliminado de la lista de roles de administrador con éxito.",
  REQUIRE_TAG_ENABLED: "Ahora todos los sistemas deberán activar las etiquetas de sistema para poder usar proxy.",
  REQUIRE_TAG_DISABLED: "Ya no será obligatorio que los sistemas activen etiquetas de sistema para usar proxy.",
  ERROR_DOESNT_EXIST: "¿Ese error no existe? ¿Acaso ya ha sido resuelto?",
  FEATURE_DISABLED_GUILD: "Esa función está desactivada en este servidor.",
  FEATURE_DISABLED_CHANNEL: "Este canal tiene desactivado el uso de PluralBuddy.",
  LOGGING_CHANNEL_SET: "Se ha establecido correctamente ese canal como canal de registros para este servidor.",
  ROLE_PREFERENCE_ALREADY_EXISTS: "Esa preferencia de rol ya existe.",
  ROLE_PREFERENCE_DOESNT_EXIST: "Esa preferencia de rol no existe.",
  ROLE_PREFERENCE_SEARCH: "Buscando roles",
  REPROXIED_MESSAGE: "Se ha reenviado el mensaje proxy con éxito.",
  ERRORS_SEARCH: "Buscando errores",
  ROLE_CONTENTS: "Contenido del contenedor de rol",
  ROLE_COLOR: "Color del contenedor de rol",
  ROLE_LOCATION: "Ubicación del contenedor de rol",
  FORM_ROLE_CONFIG: "Editando configuración de rol",
  DELAY_CHANGED: "El retraso de proxy del servidor se actualizó a %seconds% segundos (%ms%ms).",
  ROLE_NO_SPECIAL_CONFIG: "Este rol no tiene una configuración especial.",
  SET_CONTAINERS_CONTENT: "Se estableció/limpió correctamente el contenido del contenedor del rol <@&%role%>. Arriba hay una vista previa del contenedor.",
  SET_CONTAINERS_COLOR: "Se estableció/limpió correctamente el color del contenedor del rol <@&%role%>. Arriba hay una vista previa del contenedor.",
  SET_CONTAINERS_LOCATION: "Se estableció/limpió correctamente la ubicación del contenedor del rol <@&%role%>. Arriba hay una vista previa del contenedor.",
  DISABLED_FEATURE: `Se desactivó con éxito esa función.

**%name%**
> %description%`,
  ENABLED_FEATURE: `Se activó con éxito esa función.

**%name%**
> %description%`,
  AFFECTED_USER: "Consulta de usuario afectado",
  AFFECTED_CHANNEL: "Consulta de canal afectado",
  AFFECTED_ERROR_TYPE: "Consulta por tipo de error",
  NEW_TAG: "Crear nueva etiqueta",
  ASSIGN_TAG_HEADER: `## Asignar etiqueta a @{{ alterUsername }}`,
  ASSIGN_TAG: "Asignar etiqueta",
  UNASSIGN_TAG: "Desasignar etiqueta",
  PAGINATION_BOTTOM_AAT: `-# Página {{ page }}/{{ maxPage }} · Encontradas {{ alters }}/{{ maxAlters }} etiqueta(s) en {{ time }}ms {{ possibleSearchQuery }}`,
  PAGINATION_SEARCH_QUERY: `· Buscando {{ query }}`,
  AKA_PROFILE: "-# @{{ username }}",
  MESSAGE_COUNT_LABEL_PROFILE: "**Recuento de mensajes:** ",
  LAST_SENT_TIME_PROFILE: "(último enviado {{ timestamp }})",
  OWNED_BY_PROFILE: "**Asociado a:** ",
  TAGS_PROFILE: "**Etiquetas asignadas**: ",
  ID_SMALL_PROFILE: "-# ID: ",
  LIST_MORE_PROFILE: ", y {{ length }} más...",
  ALT_AVATAR: "Avatar de @{{ alter }}",
  ALT_BANNER: "Banner de @{{ alter }}",
  CURRENT_PROXY_MODE: "-# Modo actual para @{{ username }} es {{ proxyMode }}",
  UNLIMITED_ASSIGN: "Puedes asignar una cantidad ilimitada de etiquetas a un alter y una cantidad ilimitada de alters a una etiqueta.",
  AP_EXPLANATION: `Puedes configurar el modo de proxy automático. Hay tres tipos de modos de proxy automático que son **globales para todo el sistema**:
> - *Modo Alter*: Todos los mensajes enviados desde este sistema usarán proxy con este alter. Las etiquetas proxy al final de tu mensaje serán ignoradas, ya que todos los mensajes saldrán con este alter.
> - *Modo Fijado (Latch)*: El alter del último mensaje enviado con etiquetas proxy será seleccionado para los siguientes mensajes. No requiere un alter inicial, pero se puede definir uno.
> - *Desactivado*: Usar etiquetas proxy enviará un mensaje proxy con un alter, de lo contrario se enviará un mensaje normal.`,
  REQUIRED_SERVER_PROXY: "Debes estar en un servidor para usar proxy",
  SELECT_DEFAULT_PROXY: "Selecciona un modo de proxy",
  POLICY_MODAL_TITLE: "¡Bienvenido/a a PluralBuddy!",
  POLICY_MODAL_DESCRIPTION: `${emojis.clockCheck} ¡Hola, te damos la bienvenida a PluralBuddy para Discord! Para mantener a PluralBuddy como un bot seguro, requerimos que aceptes nuestra [Política de privacidad](https://pb.giftedly.dev/en/docs/policies/privacy) y [Términos de servicio](https://pb.giftedly.dev/en/docs/policies/terms) para usar el bot.

-# - El contenido NSFW no está permitido en PluralBuddy. El contenido NSFW resultará en un bloqueo instantáneo. Ten cuidado con lo que subes.
-# - Aunque PluralBuddy es un bot **enfocado en la privacidad** desde la perspectiva del usuario, debido a la naturaleza centralizada de los bots de Discord, todos los datos relacionados con el sistema que proporciones pueden ser vistos por los desarrolladores.
-# - Los desarrolladores no revisan los datos de tu sistema con frecuencia, excepto si hay sospechas de una violación de los Términos de servicio.
-# - El contenido de tus mensajes y servidor **no** se almacena en la infraestructura de PluralBuddy. Solo se guardan los IDs de mensajes y de servidores resultantes.

${emojis.reply} Esta no es una lista completa de las políticas de PluralBuddy. Si tienes dudas, abre un ticket en el [servidor de Discord de PluralBuddy](https://discord.gg/BF5bJfZY3s).
❤️ ¡Gracias por probar nuestro bot! ¡Significa mucho para nosotros! 

-# |˶˙ᵕ˙ )ﾉﾞ PluralBuddy fue creado exclusivamente por humanos y no se utilizó inteligencia artificial en su desarrollo. 
-# (๑˃ᴗ˂)ﻭ Hecho con **amor.**`,
  POLICY_MODAL_CONFIRMATION: "Confirmación",
  POLICY_MODAL_DETAIL: "Acepto la Política de privacidad y los Términos de servicio de PluralBuddy.",
  POLICY_MODAL_BLOCK_DETAIL: "Entiendo que puedo ser bloqueado/a si rompo estas reglas.",
  POLICY_MODAL_BLOCK_DESC: "Tienes 30 días para apelar un bloqueo antes de que se eliminen todos tus datos - los datos en infracción se eliminan al instante",
  LATCH_NAME: "Modo Fijado (Latch)",
  LATCH_DESC: "Establecer este alter como el alter inicial en el modo fijado.",
  ALTER_NAME: "Modo Alter",
  ALTER_DESC: "Usar solo este alter hasta que se desactive el proxy automático.",
  ALTER_DESC_DISABLED: "Esta opción no se puede seleccionar. Debes ingresar a un alter para seleccionarla.",
  OFF_NAME: "Desactivado",
  OFF_DESC: "Desactivar el proxy automático en tu sistema.",
  DELETE_DESC: "**Esto no se puede deshacer.** Eliminar un alter borrará al alter y todos sus datos.",
  PROXY_MODE_TITLE: "### {{ circleQuestion }} Modo Proxy · @{{ alterUsername }}",
  SELECT_PM: "Por favor, selecciona el modo que deseas usar a continuación.",
  FORCED_WEBHOOK_WARNING: ` {{ x }} **Este servidor aplica una política obligatoria de {{ policyType }}.** Esto significa que todos los alters deberán usar específicamente el modo proxy {{ policyType }} en este servidor. Se bloquearán tus mensajes si no usas el modo Ambos o el modo requerido.`,
  POLICY_TYPE_NICK: "apodo",
  POLICY_TYPE_WEBHOOK: "webhook",
  OPTION_BACK: "Volver",
  OPTION_NICKNAME: "Apodo",
  OPTION_WEBHOOK: "Webhook",
  OPTION_BOTH: "Ambos",
  PUBLIC_PROFILE_TITLE: `## Perfil público - @{{ alterUsername }}
Tu perfil público es cómo se ve tu alter para otros usuarios cuando identifican tus mensajes.`,
  PUBLIC_PROFILE_DN_DESC: `Los nombres para mostrar aparecen en los webhooks al enviar mensajes. Tienen menos restricciones que los nombres de usuario.
-# Nombre para mostrar: {{ currentDisplayName }}`,
  PUBLIC_PROFILE_PFP_DESC: "Puedes establecer una **foto de perfil** subiendo una imagen desde el panel de la derecha.",
  PUBLIC_PROFILE_BANNER_DESC: "Puedes establecer un **banner** subiendo una imagen desde el panel de la derecha.",
  PUBLIC_PROFILE_PN_DESC: `Puedes establecer pronombres para tu alter. Los pronombres pueden tener un máximo de 100 caracteres.
-# Los pronombres de @{{ alterUsername }} son: {{ alterPronouns }}`,
  S_PUBLIC_PROFILE_PN_DESC: `Puedes establecer pronombres para tu sistema. Los pronombres del sistema pueden tener un máximo de 100 caracteres.
-# Los pronombres de {{ systemName }} son: {{ pronouns }}`,
  PUBLIC_PROFILE_UNSET_PN: "No establecido",
  PUBLIC_PROFILE_DESC_DESC: `Puedes establecer una descripción para tu alter. Tienen un máximo de 2000 caracteres.
-# Para ver tu descripción completa, ejecuta: {{ commandMention }}`,
  T_PUBLIC_PROFILE_DESC_DESC: `Puedes establecer una descripción para tu etiqueta. Tienen un máximo de 2000 caracteres.
-# Para ver tu descripción completa, ejecuta: {{ command }}`,
  T_ORDER_STRING_DESC: `Las cadenas de orden evalúan el orden en que se muestra esta etiqueta. Cuanto más alfabético sea esta cadena, más alta aparecerá la etiqueta. Las etiquetas sin cadena de orden se ordenan por última vez. Las cadenas de pedido no se mostran, y sólo pueden tener como máximo 4 caracteres.
-# Esta cadena de orden de etiquetas es: {{ order }}`,
  S_PUBLIC_PROFILE_DESC_DESC: `Puedes establecer una descripción para tu sistema. Tienen un máximo de 2000 caracteres.
-# Para ver tu descripción completa, ejecuta: {{ mention }}`,
  PUBLIC_PROFILE_COLOR_DESC: "Establecer un color para un alter muestra ese color en su contenedor de rango y en su perfil público.",
  PUBLIC_PROFILE_SYSTEM_TAG_DESC: `Puedes establecer una etiqueta de sistema para tu sistema. Las descripciones de sistema pueden tener un máximo de 75 caracteres.
-# La etiqueta del sistema {{ systemName }} es: {{ displayTag }}`,
  ALTER_TOP_VIEW: `-# @{{ alterUsername }}> • ID: `{{ alterId }}\``,
  GENERAL_LABEL: "General",
  TOP_BACK_LABEL: "Volver",
  ALTER_PROXY_TAGS_LABEL: "Etiquetas proxy",
  PUBLIC_PROFILE_LABEL: "Perfil público",
  ROLES_LABEL: "Roles",
  FEATURES_LABEL: "Funciones",
  ERROR_LOG_LABEL: "Registro de errores",
  ALTERS_LABEL: "Alters",
  TAGS_LABEL: "Etiquetas",
  CONFIGURE_PROFILE_BTN: "Configurar perfil",
  MESSAGE_INFO_CONTENTS: `**ID del mensaje:** {{ messageId }}
**Enviado por:** <@{{ userId }}> ({{ userId }})

**Roles de la cuenta ({{ roleCount }})**
{{ roleList }}`,
  NUDGE_PREF_TITLE: "## Preferencias de toques (Nudges)",
  ENABLE_NUDGING: "Activar toques",
  DISABLE_NUDGING: "Desactivar toques",
  NUDGING_DESC: "Los toques permiten a otros usuarios mencionarte o darte un toque según tu alter. Puedes cambiar esta opción en cualquier momento. Desactivarla no te quita la capacidad de dar toques a otros, solo evita que otros te los den a ti.",
  DM_REPLIES_DESC: "Las respuestas por DM te enviarán un mensaje privado cuando alguien te responda. **Debes tener los DMs activados en al menos uno de los servidores en los que estoy o no podré contactarte.**",
  DISABLE_DM: "Desactivar respuestas por DM",
  ENABLE_DM: "Activar respuestas por DM",
  BLOCK_USERS_DESC: `Puedes bloquear a usuarios específicos para que no te den toques. Actualmente, tienes {{ userCount }} usuario(s) bloqueado(s).`,
  EXPORT_NUDGE_BLOCKLIST: "Exportar lista de bloqueos de toques",
  VIEW_NUDGE_BLOCKLIST: "Ver lista de bloqueos de toques",
  REMOVE_NUDGE_BLOCKED_USER: "Eliminar usuario",
  ADD_NUDGE_BLOCKED_USER: "Añadir usuario",
  SP_IMPORT_DESC: `### Paso 1: Obtener un token de Simply Plural
PluralBuddy requiere que crees un token de Simply Plural para importar datos.
> PluralBuddy solo ve tu token una vez. Una vez obtenidos los datos, el token se destruye.

Para crear un token:
1. Abre el menú de navegación -> toca el icono del engranaje
2. Cuenta -> Tokens
3. Toca añadir token y selecciona el permiso "Read" (Lectura)
4. Añadir token -> Copia el token creado.`,
  ALT_NAV_MENU: "Menú de navegación",
  ALT_GEAR: "Engranaje",
  ALT_ACCOUNTS: "Cuentas",
  ALT_TOKENS: "Tokens",
  ALT_NEW_TOKEN: "Añadir nuevo token",
  ALT_READ_SCOPE: "Permiso de lectura",
  ALT_COPY_TOKEN: "Copiar token",
  SP_STEPTWO_DESC: `### Paso 2: Importar contenidos del sistema
Por favor, pega el token de sistema de SimplyPlural en PluralBuddy.`,
  SP_UPLOAD: "Subir token",
  PK_DESC: `### Paso 1: Exportar contenido del sistema de PluralKit
Debes exportar el archivo JSON de tu sistema desde PluralKit para importarlo en PluralBuddy. Para hacerlo, envía \`pk;export\` en un servidor donde esté PluralKit o envía \`pk;export\` por mensaje directo a <@466378653216014359>.`,
  PK_STEPTWO_DESC: `### Paso 2: Importar contenidos del sistema
Descarga el archivo JSON que recibiste y usa el botón a continuación para subirlo a PluralBuddy.`,
  PK_UPLOAD: "Subir JSON",
  SRV_CFG_ID: "-# ID del servidor: `{{ guildId }}`",
  SRV_CFG_TITLE: "## Preferencias del servidor",
  SRV_CFG_PREFIXES_DESC: `**Configurar prefijos**
> Puedes configurar y establecer prefijos. Puedes tener prefijos ilimitados, separados por comas.
> Tus prefijos actuales son: {{ prefixList }}`,
  SRV_CFG_PREFIXES_BTN: "Establecer prefijos",
  SRV_CFG_BLOCKS_DESC: `**Configurar bloqueos**
> Se pueden bloquear roles y canales para que no usen proxy o comandos de PluralBuddy.`,
  SRV_CFG_BLOCKS_ITEMS: `> Actualmente, los elementos bloqueados en el servidor son: {{ list }}`,
  SRV_CFG_BLOCKS_ITEMS_EMPTY: "> - _No hay elementos bloqueados._",
  SRV_CFG_BLOCKS_ITEMS_MORE: `
> - ... y {{ count }} elemento(s) más. Usa {{ commandMention }} para ver el resto.`,
  SRV_CFG_ADD_CHANNELS: "Añadir canales",
  SRV_CFG_ADD_CATEGORIES: "Añadir categoría",
  SRV_CFG_ADD_ROLES: "Añadir roles",
  SRV_CFG_REMOVE_CATEGORY: "Eliminar categoría",
  SRV_CFG_SYS_TAGS_D: "Desactivar etiquetas del sistema obligatorias",
  SRV_CFG_SYS_TAGS_E: "Activar etiquetas del sistema obligatorias",
  SRV_CFG_SYS_REQ_TAGS: `**Requerir etiquetas del sistema**
> Los servidores pueden exigir etiquetas de sistema. Haz clic en el botón de la derecha para cambiar este requisito.`,
  SRV_CFG_MANAGE_ROLES: "Añadir roles de administrador",
  SRV_CFG_MANAGERS_DESC: `**Administradores del servidor**
> Los administradores del servidor pueden acceder a toda la configuración en PluralBuddy. Puedes tener hasta 25 roles de administrador.
> Para configurar administradores, debes tener un rol con permisos de Administrador o Gestionar roles. Los administradores no pueden añadir/eliminar otros roles de administrador.`,
  CURRENT_SRV_MANAGERS: `> Actualmente, los roles de administrador son:{{ list }}`,
  CURRENT_SRV_MANAGERS_EMPTY: `> - _No hay roles de administrador._`,
  CURRENT_SRV_MANAGERS_EXTRA: `
> - ... y {{ count }} rol(es) adicional(es). Usa {{ mentionCommand }} para ver el resto.`,
  SRV_CFG_LOGS_TITLE: `**Canales de registro**
> Puedes registrar los mensajes enviados por proxy a través de PluralBuddy para monitorear el uso. Puedes asignar un canal para los registros de proxy.`,
  SRV_CFG_LOGS_DESC: `> El canal de registros actual de este servidor es: {{ logChannel }}`,
  SRV_CFG_LOGS_UNSET: "_No establecido_",
  SRV_CFG_LOGS_BTN: "Establecer canal de registros",
  SRV_CFG_PROXY_DELAY: "Establecer retraso de proxy",
  SRV_CFG_PROXY_DELAY_DESC: `**Retraso de proxy**
> Tras recibir los datos de un nuevo mensaje, en condiciones óptimas, PluralBuddy suele enviar el proxy en <600ms. Sin embargo, si usas un bot de moderación más lento, puedes aumentar este retraso.`,
  SRV_CFG_PROXY_DELAY_SEC: `> No se recomienda superar 1 segundo de retraso.
> El retraso actual en este servidor es de **{{ delay }} segundos** ({{ delayMs }}ms)`,
  ERROR_LOG_TITLE: `## Registro de errores - {{ serverName }}`,
  NO_ERRORS: "{{ catJamming }} ¡Genial! ¡Tu servidor no ha registrado ningún error!",
  ERROR_TRIGGERED_BY: `Activado por <@{{ userId }}>.`,
  ERROR_TRIGGERED_IN: "Activado en <#{{ channelId }}>.",
  PAGINATION_BOTTOM_ERRORS: `-# Página {{ page }}/{{ maxPage }} · Encontrados {{ errors }}/{{ maxErrors }} error(es) {{ possibleSearchQuery }}`,
  ERROR_LOG_SEARCHING_FOR: "· Buscando {{ query }}",
  FEATURE_FLAGS_TITLE: `## Banderas de funciones - {{ guildName }}
> Las banderas de funciones te permiten controlar pequeñas características utilizadas en PluralBuddy.`,
  FEATURE_D: "Desactivar",
  FEATURE_E: "Activar",
  ROLE_TOP: "-# <@&{{ roleId }}> • ID: \`{{ roleId }}\`",
  ROLE_CONFIG_TITLE: `## Configuración de rol - <@&{{ roleId }}>
> La configuración de rol te permite añadir contenedores específicos a los mensajes proxy para indicar que provienen de un usuario con un rol determinado.`,
  ROLE_CONTAINER_CONTENTS_BTN: "Editar contenido del contenedor",
  ROLE_CONTAINER_CONTENTS_DESC: `**Contenido del contenedor de rol**
> Este es el contenido real dentro del contenedor específico del rol. Es necesario para que el contenedor aparezca. Si está en blanco, no se mostrará.`,
  ROLE_CONTAINER_COLOR_BTN: "Editar color del contenedor",
  ROLE_CONTAINER_COLOR_DESC: `**Color del contenedor de rol**
> Los contenedores en Discord pueden tener un color. De lo contrario, el marcador se muestra en blanco.`,
  ROLE_CONTAINER_LOCATION_BTN: "Editar ubicación del contenedor",
  ROLE_CONTAINER_LOCATION_DESC: `**Ubicación del contenedor de rol**
> PluralBuddy puede ubicar el contenedor por encima o por debajo del contenido del mensaje.

A continuación hay un ejemplo de cómo se vería un mensaje proxy con este rol:`,
  CONTENTS_EMPTY: "-# No hay contenedor para este rol ya que el contenido está vacío.",
  EXAMPLE_PROXY_TEXT: "Texto de ejemplo de proxy. ¡Hola!",
  TAGS_PROFILE_LABEL: "**Etiquetas:** ",
  ALTERS_PROFILE_LABEL: "**Alters:** ",
  GENERAL_SYSTEM_TITLE: `## {{ emoji }} Configuración general - {{ systemName }}`,
  SYSTEM_NAME_BTN: "Establecer nombre del sistema",
  SYSTEM_NAME_DESC: "El título de tu sistema es lo primero que lo identifica y aparece en la estructura superior para todos los miembros. Debe tener entre 3 y 20 caracteres de longitud.",
  SYSTEM_NICKNAME_FORMAT_BTN: "Establecer formato de apodo",
  SYSTEM_NICKNAME_FORMAT_DESC: "El formato de apodo define cómo se muestra tu nombre cuando un alter usa el modo proxy *Apodo*. Por defecto es solo el nombre de usuario del alter, pero puedes personalizarlo.",
  SYSTEM_PRIVACY_BTN: "Establecer privacidad del sistema",
  SYSTEM_PRIVACY_DESC: "Por defecto, tu sistema es completamente privado, salvo por la automoderación del servidor y si usas comandos públicamente \n(con \\`-public\\` al final). Configurar estos valores le indica a PluralBuddy qué mostrar a los demás.",
  SYSTEM_AP_DESC: `Puedes configurar el modo de proxy automático. Hay tres tipos de modos de proxy automático que son **globales para todo el sistema**:
> - *Modo Alter*: Todos los mensajes enviados desde este sistema usarán proxy con un alter específico. Las etiquetas proxy se ignorarán. **Requiere seleccionar un alter.**
> - *Modo Fijado (Latch)*: Se elegirá el alter del último mensaje enviado con etiquetas proxy para los siguientes mensajes.
> - *Desactivado*: Usar etiquetas proxy enviará un mensaje proxy, de lo contrario se enviará un mensaje normal.`,
  EXPORT_SYS_BTN: "Exportar sistema",
  EXPORT_SYS_DESC: "Exportar el sistema simplemente extraerá todos los datos y los enviará a tus mensajes directos (DMs). Asegúrate de tener los DMs abiertos para PluralBuddy antes de exportar.",
  EXTERNAL_EXPORT_SYS_DESC: "Puedes exportar externamente a otro servicio haciendo clic en la opción deseada a continuación:",
  IMPORT_SYS_BTN: "Importar sistema",
  IMPORT_SYS_DESC: "Importar tu sistema te permite traer datos desde otros bots mediante diferentes modos de importación.",
  DANGER_ZONE_TITLE: "## Zona de peligro",
  SYSTEM_E: "Activar sistema",
  SYSTEM_D: "Desactivar sistema",
  SYSTEM_D_DESC: "Desactivar un sistema desactivará la **capacidad de usar proxy** en todos los servidores y se puede deshacer más adelante. **Todos tus alters, etiquetas y recursos seguirán accesibles, pero __NO PODRÁS enviar mensajes proxy__**.",
  DELETE_SYS_BTN: "Eliminar sistema",
  DELETE_SYS_DESC: "**Esto no se puede deshacer**. Eliminar tu sistema **borrará los datos del sistema __junto con todos los alters, etiquetas y demás recursos__**. **__USA ESTO CON PRECAUCIÓN__**.",
  ALTERS_TITLE: "## Alters",
  NO_PUBLIC_ALTERS_DESC: "*No hay alters públicos en esta página.*",
  ALTERS_PAGINATION: `-# Página {{ page }}/{{ maxPage }} · Encontrados {{ alters }}/{{ maxAlters }} alter(s) en {{ time }}ms{{ possibleSearchQuery }}`,
  ALTERS_POSSIBLE_SQ: `· Buscando {{ query }}`,
  ALTER_EDIT: "Editar alter",
  NEW_TAG_BTN: "Crear nueva etiqueta",
  TAG_TITLE: "## Etiquetas",
  TAG_EDIT: "Editar etiqueta",
  TAGS_PAGINATION: `-# Página {{ page }}/{{ maxPage }} · Encontradas {{ alters }}/{{ maxAlters }} etiqueta(s) en {{ time }}ms{{ possibleSearchQuery }}`,
  S_PUBLIC_PROFILE_TITLE: `## Perfil público - @{{ systemName }}
Tu perfil público es cómo se ve tu sistema para otros usuarios cuando identifican tus mensajes.`,
  IMPORT_SETTINGS_TITLE: `## Importar datos desde otro bot`,
  IMPORT_SETTINGS_DESC: `Importar desde otro bot te permite reemplazar o agregar datos provenientes de tus otros bots, o hacer una combinación de ambos.`,
  REPLACE_DESC: "Reemplazar sustituirá los datos existentes en tu sistema con los datos nuevos. No crea un nuevo sistema.",
  REPLACE_NAME: "Reemplazar",
  ADD_DESC: "Agregar añadirá nuevas etiquetas y alters desde otro bot. No reemplaza los datos existentes.",
  ADD_NAME: "Agregar",
  FULL_IMPORT_DESC: "El modo de importación completa reemplazará los alters existentes y agregará los nuevos.",
  FULL_IMPORT_NAME: "Importación completa",
  DELETE_IMPORT_DESC: "El modo de importación con eliminación removerá los alters/etiquetas existentes que no estén presentes en el archivo importado.",
  DELETE_NAME: "Eliminar",
  EXISTING_ALTER: "Ya existe un alter con ese nombre de usuario. Elige otro.",
  ALTER_COUNT_LABEL: "**Recuento de alters:** ",
  SELF_REACTION_ERR: "No se pudo remover la reacción propia",
  SELF_REACTION_DESC: "PluralBuddy no pudo remover el emoji de carga al intentar realizar una [Acción del menú contextual](<https://pb.giftedly.dev/docs/pluralbuddy/context-actions>).",
  REACTION_ERR: "No se pudo remover la reacción del usuario",
  REPLY_IN_RESPONSE: "-# {{ reply }} En respuesta a: {{ link }}",
  AWAKE: "¡Hola! Estoy activo, ejecutando PluralBuddy `{{ buildNumber }}/{{ branch }}`.",
  LINK_INVITE: "Invitar",
  LINK_SUPPORT: "Soporte",
  LINK_DOCS: "Documentación",
  DISPLAY_TAG_ENFORCE: "Política de aplicación de etiqueta visible",
  DISPLAY_TAG_ENFORCE_DESC: "Este usuario no puede enviar mensajes proxy en este servidor sin una etiqueta de sistema debido a la política del servidor. Activa las etiquetas de sistema yendo a `pb;system config` -> \"Perfil público\".",
  NO_DM_CHANNELS: "No puedes enviar mensajes proxy en canales de mensajes directos. ¡Lo sentimos!",
  NOTIFIED_1: "-# Se te notificó de esta acción debido a tu asociación con tu alter de PluralBuddy.",
  NOTIFIED_2: "-# Desarrollado como software de código abierto en [pb.giftedly.dev](<https://pb.giftedly.dev>)",
  OPT_OUT_DMS: "Desactivar DMs",
  UNDO_BTN: "Deshacer operación",
  EXPIRED: "Expirado",
  NOT_ORIGINAL_RECIPIENT: "No eres el destinatario original del mensaje.",
  IMPORT_REQ_DESC: "Para enviar tus datos de importación desde otro bot, debes ingresarlos en el panel de control de PluralBuddy.",
  IMPORT_REQ_WAITING: "-# Esperando respuesta...\n-# Esto expira en 15 minutos.",
  VIEW_DASH: "Ver en el panel de control",
  INCLUDE_PROXY_TAGS_DESC: "Incluir etiquetas proxy evitará que se omitan automáticamente las etiquetas proxy en el mensaje enviado por PluralBuddy.",
  INCLUDE_PROXY_TAGS_BTN: "Incluir etiquetas proxy",
  INCLUDE_PROXY_TAGS_OFF_BTN: "Desactivar inclusión de etiquetas proxy",
  INCLUDE_PRONOUNS_DESC: "Incluir pronombres añadirá los pronombres entre paréntesis al nombre del webhook cada vez que envíes un mensaje proxy.",
  INCLUDE_PRONOUNS_BTN: "Incluir pronombres",
  INCLUDE_PRONOUNS_OFF_BTN: "Desactivar inclusión de pronombres",
  VALIDATION_TAG_ERROR: "Ocurrió un error al crear esa etiqueta:",
  ERROR_CREATING_WEBHOOK_TITLE: "Error al crear el webhook para <#{{ channelId }}>",
  ERROR_CREATING_WEBHOOK_DESC: "Ocurrió un error al crear el webhook correspondiente para <#{{ channelId }}>. Verifica si PluralBuddy tiene los permisos correctos en ese canal.",
  SET_LANGUAGE_DESC: `## {{ gear }} Establecer idioma de PluralBuddy
Puedes establecer el idioma que usa PluralBuddy en sus comandos. Si no se encuentra un texto, se utilizará la versión en inglés como alternativa.

{{ languages }}`,
  SET_LANGUAGE_TO: "Se cambió con éxito el idioma a **{{ language }}**.",
  ALTER_AP_NAME: "Modo Alter",
  ALTER_AP_DESC: "Usar solo este alter hasta que se desactive el proxy automático.",
  EXPRESS_HERO: `### Presentamos PluralBuddy Express
PluralBuddy Express permite a los alters enviar mensajes proxy en DMs o en otros entornos donde PluralBuddy no está presente de forma directa.
 - Creas una aplicación en el Portal de Desarrolladores de Discord
 - PluralBuddy obtiene el token, lo encripta y aloja un bot de comando único asociado a tu alter
 - $0, para siempre

Haz clic en el botón de la derecha para abrir este alter en el panel de control.`,
  STATUS_AP: `### Estado del proxy automático
Tu sistema actualmente tiene activado el proxy automático en **{{ mode }}**.`,
  INTEGRATION_AP: `### Estado del proxy automático
Tu sistema está utilizando el estado al frente de **{{ mode }}**.`,
  NO_STATUS_AP: `Actualmente no estás usando el proxy automático en este ámbito.`,
  NO_ALTER_AP: `Tu proxy automático no está vinculado a ningún alter en este momento.`,
  DISABLED_SERVER: `Este servidor tiene desactivado el envío de mensajes proxy.`,
  AP_AS: "-# **PROXY AUTOMÁTICO ACTIVO COMO:**",
  AP_INTEGRATION_AS: "-# **{{ provider }} AL FRENTE COMO:**",
  PROVIDER_NOT_FOUND: `No se encontró ese proveedor de proxy automático o no autorizaste con el permiso [\`system:ai-ap\`](https://pb.giftedly.dev/docs/pluralbuddy/ai-ap). Contacta al desarrollador de esta integración si crees que es un error.
	
-# Integración: \`{{ id }}\``,
  AP_INVALID_SYNTAX: `Modo de proxy automático o proveedor inválido \`{{ mode }}\`.

**Uso de proxy automático:**
\`pb;autoproxy [off|latch|alter|status|{{ aiap }}]\``,
  AP_ALTER_INVALID_SYNTAX: `Debes especificar un alter para el modo proxy \`alter\`.

**Uso de proxy automático:**
\`pb;autoproxy [off|latch|alter|status|{{ aiap }}]\``,
  AP_SYNTAX: `**Uso de proxy automático:**
\`pb;autoproxy [off|latch|alter|status|{{ aiap }}]\``,
  SUCCESS_DISABLE_GUILD: "Se desactivó con éxito el proxy en **{{ guild }}**.",
  SUCCESS_ENABLE_GUILD: "Se activó con éxito el proxy en **{{ guild }}**.",
  PROXYING_ALREADY_ENABLED: "El proxy ya estaba activado en este servidor.",
  PROXYING_ALREADY_DISABLED: "El proxy ya estaba desactivado en este servidor.",
  TOGGLED_INCLUDING_PROXY_TAGS_E: "Se cambió la opción de incluir etiquetas proxy. (activado)",
  TOGGLED_INCLUDING_PROXY_TAGS_D: "Se cambió la opción de incluir etiquetas proxy. (desactivado)",
  TOGGLED_INCLUDING_PRONOUNS_E: "Se cambió la opción de incluir pronombres. (activado)",
  TOGGLED_INCLUDING_PRONOUNS_D: "Se cambió la opción de incluir pronombres. (desactivado)",
  NOT_FRIDAY: "Flatworm Friday solo se celebra los viernes en Nueva York, vuelve el próximo viernes a Wall Street o usa `--time-machine`.",
  EXPRESS_DISCONTINUED: "Lo sentimos, PluralBuddy Express ha sido interrumpido desde el 08/11/26. ¡Utiliza una alternativa como [/plu/ral](https://plural.gg) en su lugar! ¡Las aplicaciones exprés seguirán enviando mensajes!",
  NO_TYPING_STATUS: "Deshabilitar el estado de escritura eliminará el estado de escritura que aparece cuando este proxy del sistema. Los estados de escritura todavía no aparecen si el servidor lo desactiva.",
  NO_TYPING_STATUS_BTN: "Deshabilitar estados de escritura",
  NO_TYPING_STATUS_BTN_D: "Reactivar Estados de escritura",
  TOGGLED_TYPING_STATUS_E: "Se ha cambiado correctamente el estado de escritura. (activado)",
  TOGGLED_TYPING_STATUS_D: "Se ha cambiado correctamente el estado de escritura. (desactivado)"
};