/*=========================================================================================
  File Name: moduleCalendarActions.js
  Description: Calendar Module Actions
  ----------------------------------------------------------------------------------------
  Item Name: Vuexy - Vuejs, HTML & Laravel Admin Dashboard Template
  Author: Pixinvent
  Author URL: http://www.themeforest.net/user/pixinvent
==========================================================================================*/

import axios from "@/axios.js";
import { server } from "../../main";

export default {
  addEvent({ dispatch, commit }, event) {
    let formData = new FormData();
    formData.append("id", 0);
    formData.append("idusuario", event.idusuario);
    formData.append("nombre", event.title);
    formData.append("observacion_admin", event.observacion);
    formData.append("label", event.label);
    formData.append("classes", event.classes);
    formData.append("fecha_inicio", event.endDate);
    formData.append("fecha_fin", event.endDate);
    formData.append("hora_inicio", event.hora_inicio);
    formData.append("hora_fin", event.hora_fin);
    formData.append("tema_id", event.tema_id);
    formData.append("capacitador", event.capacitador);
    formData.append("id_institucion", event.institucion_id);
    formData.append("institucion_id_temporal", event.institucion_id_temporal);
    formData.append(
      "estado_institucion_temporal",
      event.estado_institucion_temporal
    );
    formData.append("periodo_id_temporal", event.periodo_id_temporal);
    formData.append("nombreInstitucion", event.nombreInstitucion);
    formData.append("tipo", event.tipo);
    formData.append("asistentes", event.asistentes);
    formData.append("link_reunion", event.link_reunion || '');
    formData.append("oferta_academica", event.oferta_academica);
    formData.append("area_capacitacion", event.area_capacitacion);
    return new Promise((resolve, reject) => {
      axios
        .post(server + "capacitacion", formData)
        .then((response) => {
          commit("ADD_EVENT", Object.assign(event, { id: response.data.id }));
          dispatch("fetchEvents");
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  fetchEvents({ commit }) {
    // let eventos = [
    //   {id: '1', title: 'evento prueba', url: 'prueba.com', startDate: '2021-10-20 22:28:10', endDate: '2021-10-21 23:28:10', "classes": "event-success", "label": "business"}
    // ]
    let usuario = JSON.parse(localStorage.getItem("usuario"));
    return new Promise((resolve, reject) => {
      axios
        .get(server + "capacitacion?id_usuario=" + usuario.idusuario)
        .then((response) => {
          commit("SET_EVENTS", response.data);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  fetchEventLabels({ commit }) {
    let eventos = [
      { text: "Urgente", color: "danger" },
      { text: "Importante", color: "warning" },
      { text: "Normal", color: "primary" },
      { text: "Baja", color: "success" },
    ];
    return new Promise((resolve, reject) => {
      commit("SET_LABELS", eventos);
      resolve(eventos);
    });
  },
  editEvent({ dispatch, commit }, event) {
    let formData = new FormData();
    formData.append("id", event.id);
    formData.append("idusuario", event.idusuario);
    formData.append("nombre", event.title);
    formData.append("observacion_admin", event.observacion);
    formData.append("label", event.label);
    formData.append("classes", event.classes);
    formData.append("fecha_inicio", event.endDate);
    formData.append("fecha_fin", event.endDate);
    formData.append("hora_inicio", event.hora_inicio);
    formData.append("hora_fin", event.hora_fin);
    formData.append("tema_id", event.tema_id);
    formData.append("capacitador", event.capacitador);
    formData.append("id_institucion", event.institucion_id);
    formData.append("institucion_id_temporal", event.institucion_id_temporal);
    formData.append(
      "estado_institucion_temporal",
      event.estado_institucion_temporal
    );
    formData.append("periodo_id_temporal", event.periodo_id_temporal);
    formData.append("nombreInstitucion", event.nombreInstitucion);
    formData.append("tipo", event.tipo);
    formData.append("link_reunion", event.link_reunion);
    formData.append('editor_id', event.idusuario)
    formData.append("asistentes", event.asistentes);
    formData.append("oferta_academica", event.oferta_academica);
    formData.append("area_capacitacion", event.area_capacitacion);
    return new Promise((resolve, reject) => {
      axios
        .post(server + "capacitacion", formData)
        .then((response) => {
          if(response.data.status == 0){
            reject(response.data.message)
            return
          }
          // Convert Date String to Date Object
          // const event = response.data
          // event.startDate = new Date(event.startDate)
          // event.endDate = new Date(event.endDate)

          dispatch("fetchEvents");
          // commit('UPDATE_EVENT', event)
          resolve(response)
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  removeEvent({ commit }, eventId) {
    return new Promise((resolve, reject) => {
      axios
        .get(server + `delete_agenda_asesor/${eventId}`)
        .then((response) => {
          commit("REMOVE_EVENT", response.data);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
  eventDragged({ commit }, event) {
    let formData = new FormData();
    formData.append("id", event.id);
    formData.append("idusuario", event.idusuario);
    formData.append("nombre", event.title);
    formData.append("observacion_admin", event.observacion);
    formData.append("label", event.label);
    formData.append("classes", event.classes);
    formData.append("fecha_inicio", event.endDate);
    formData.append("fecha_fin", event.endDate);
    formData.append("hora_inicio", event.hora_inicio);
    formData.append("hora_fin", event.hora_fin);
    formData.append("tema_id", event.tema_id);
    formData.append("capacitador", event.capacitador);
    formData.append("id_institucion", event.institucion_id);
    formData.append("institucion_id_temporal", event.institucion_id_temporal);
    formData.append(
      "estado_institucion_temporal",
      event.estado_institucion_temporal
    );
    formData.append("periodo_id_temporal", event.periodo_id_temporal);
    formData.append("nombreInstitucion", event.nombreInstitucion);
    formData.append("tipo", event.tipo);
    formData.append("link_reunion", event.link_reunion);
    formData.append("asistentes", event.asistentes);
    formData.append("oferta_academica", event.oferta_academica);
    formData.append("area_capacitacion", event.area_capacitacion);
    return new Promise((resolve, reject) => {
      axios
        .post(server + "capacitacion", formData)
        .then((response) => {
          // Convert Date String to Date Object
          const event = response.data;
          event.startDate = new Date(event.endDate);
          event.endDate = new Date(event.endDate);

          commit("UPDATE_EVENT", event);
          resolve(response);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
};
