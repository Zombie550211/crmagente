// Módulo de comentarios para la tabla Costumer
// Maneja: mostrar resumen, expandir panel, historial, añadir, guardar con usuario/fecha

// --- Lógica para editar y borrar comentarios en la tabla de clientes ---
window.iniciarEdicionComentario = function(idx, cidx) {
  document.getElementById('comentario-texto-' + idx + '-' + cidx).style.display = 'none';
  document.getElementById('comentario-edicion-' + idx + '-' + cidx).style.display = '';
};

window.cancelarEdicionComentario = function(idx, cidx) {
  document.getElementById('comentario-edicion-' + idx + '-' + cidx).style.display = 'none';
  document.getElementById('comentario-texto-' + idx + '-' + cidx).style.display = '';
};

window.guardarEdicionComentario = async function(idx, cidx) {
  try {
    const textarea = document.getElementById('editar-comentario-textarea-' + idx + '-' + cidx);
    const nuevoTexto = textarea.value.trim();
    if (!nuevoTexto) {
      alert('El comentario no puede estar vacío.');
      return;
    }
    // Obtener leadId y comentarioId
    const leadId = window.ultimaListaLeads[idx]._id;
    const comentario = window.ultimaListaLeads[idx].comentarios_venta[cidx];
    const comentarioId = comentario._id;
    const resp = await fetch(`/api/leads/${leadId}/comentarios/${comentarioId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      },
      body: JSON.stringify({ texto: nuevoTexto })
    });
    if (resp.ok) {
      window.cargarDatosDesdeServidor();
    } else {
      alert('No se pudo editar el comentario.');
    }
  } catch (e) {
    alert('Error al editar comentario.');
  }
};

window.confirmarBorrarComentario = async function(idx, cidx) {
  if (!confirm('¿Seguro que deseas borrar este comentario?')) return;
  try {
    const leadId = window.ultimaListaLeads[idx]._id;
    const comentario = window.ultimaListaLeads[idx].comentarios_venta[cidx];
    const comentarioId = comentario._id;
    const resp = await fetch(`/api/leads/${leadId}/comentarios/${comentarioId}`, {
      method: 'DELETE',
      headers: {
        'Authorization': `Bearer ${localStorage.getItem('token')}`
      }
    });
    if (resp.ok) {
      window.cargarDatosDesdeServidor();
    } else {
      alert('No se pudo borrar el comentario.');
    }
  } catch (e) {
    alert('Error al borrar comentario.');
  }
};

window.toggleComentariosPanel = function(idx) {
  const panel = document.getElementById('comentarios-panel-' + idx);
  if (panel) {
    panel.style.display = panel.style.display === 'none' ? '' : 'none';
  }
};

window.enviarNuevoComentario = async function(idx, leadId) {
  const textarea = document.getElementById('nuevo-comentario-textarea-' + idx);
  const texto = textarea.value.trim();
  if (!texto) return;
  const usuario = window.usuario_actual ? window.usuario_actual.nombre : 'Desconocido';
  const fecha = new Date();
  const fechaStr = fecha.toLocaleDateString('es-MX') + ' ' + fecha.toLocaleTimeString('es-MX', { hour: '2-digit', minute: '2-digit', hour12: true });
  const comentarioObj = { autor: usuario, fecha: fechaStr, texto };
  // Guardar en backend
  await fetch(`/api/leads/${leadId}/comentarios`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${localStorage.getItem('token')}` },
    body: JSON.stringify(comentarioObj)
  });
  textarea.value = '';
  window.cargarDatosDesdeServidor();
};
