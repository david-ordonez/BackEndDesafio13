import fm from "../util/filemanager.js";

class ContenedorArchivo {
  constructor(ruta) {
    this.ruta = ruta;
  }

  async listar(id) {
      try {
          const elementos = await this.listarAll();
          const elem = elementos.find(elem => elem.id == id)
          return elem || { error: `elemento no encontrado` }
      } catch (error) {
          throw error;
      }
  }

  async listarAll() {
    try {
      const elementos = await fm.readFile(this.ruta);
      return elementos;
    } catch (error) {
      throw error;
    }
  }

  async guardar(elem) {
    try {
      let newId;
      const elementos = await fm.readFile(this.ruta);
      if (elementos.length == 0) {
        newId = 1;
      } else {
        newId = elementos[elementos.length - 1].id + 1;
      }
      elementos.push({ ...elem, id: newId });
      await fm.saveFile(this.ruta, JSON.stringify(elementos, null, 2));
    } catch (error) {
      console.log(error);
    }
  }

  async actualizar(elem) {

  }

  async borrar(id) {
      
  }

  async borrarAll() {
    try {
      const elementos = await fs.promises.writeFile(this._fileName, "");
    } catch (error) {
      console.log(error);
    }
  }
}

export default ContenedorArchivo;
