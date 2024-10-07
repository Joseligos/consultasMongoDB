
// 1. Colección: Equipo

// Insertar Equipos
db.Equipo.insertMany([
    {
      "id_equipo": "1",
      "Nombre": "Los Innovadores",
      "Categoria": "Avanzada",
      "eventos": [
        {
          "id_evento": "9"
        },
        {
          "id_evento": "6"
        }
      ]    
    },
    {
      "_id": {
        "$oid": "6701e012d887ee370357d6f1"
      },
      "id_equipo": "2",
      "Nombre": "Creadoras del Futuro",
      "Categoria": "Principiante",
      "eventos": [
        {
          "id_evento": "2"
        },
        {
          "id_evento": "8"
        }
      ]    
    },
    {
      "_id": {
        "$oid": "6701e012d887ee370357d6f2"
      },
      "id_equipo": "3",
      "Nombre": "Visionarios Tech",
      "Categoria": "Avanzada",
      "eventos": [
        {
          "id_evento": "3"
        },
        {
          "id_evento": "7"
        }
      ]    
    }
  ]);
  
  // Obtener todos los Equipos
  db.Equipo.find().pretty();
  
  // Obtener un Equipo por su _id
  db.Equipo.findOne({ _id: ObjectId("6701e012d887ee370357d6f0") });
  
  // Obtener un Equipo por su id_equipo
  db.Equipo.findOne({ "id_equipo": "1" });

  // Actualizar la categoria de un equipo 
  db.Equipo.updateOne(
      { "Nombre": "Visionarios Tech" },
      { $set: { "Categoria": "Principiante" } }
  )
  
  // Eliminar un Equipo por su _id
  db.Equipo.deleteOne({ _id: ObjectId("6701e012d887ee370357d6f0") });
  
  // Aggregations Equipo
  // Obtener los nombres de los equipos que han participado en eventos internacionales
  [
    {
      $lookup:
        {
          from: "Eventos",
          localField: "eventos.id_evento",
          foreignField: "id_evento",
          as: "eventos_info"
        }
    },
    {
      $match:
        {
          "eventos_info.Alcance": "Internacional"
        }
    },
    {
      $project:
        {
          _id: 0,
          Nombre: 1
        }
    }
  ]
  // Listar los eventos en los que ha participado el equipo "Visionarios Tech" y su alcance
  [
    {
      $match:
        {
          Nombre: "Visionarios Tech"
        }
    },
    {
      $lookup:
        {
          from: "Eventos",
          localField: "eventos.id_evento",
          foreignField: "id_evento",
          as: "eventos_info"
        }
    },
    {
      $unwind:
        {
          path: "$eventos_info"
        }
    },
    {
      $project:
        {
          _id: 0,
          Evento: "$eventos_info.Nombre",
          Alcance: "$eventos_info.Alcance"
        }
    }
  ]
  // Obtener la lista de equipos que participan en eventos en la ciudad de "Bogotá"
  [
    {
      $lookup:
        {
          from: "Eventos",
          localField: "eventos.id_evento",
          foreignField: "id_evento",
          as: "eventos_info"
        }
    },
    {
      $unwind:
        {
          path: "$eventos_info"
        }
    },
    {
      $match:
        {
          "eventos_info.Ciudad": "Bogotá"
        }
    },
    {
      $project:
        {
          _id: 0,
          Nombre: 1
        }
    }
  ]
  
  // 2. Colección: Eventos
  
  // Insertar Eventos
  db.Eventos.insertMany([
    {
      "id_evento": "1",
      "Alcance": "Internacional",
      "Pais": "Colombia",
      "Ciudad": "Bogotá",
      "Fecha": "2023-09-15",
      "Lugar": "Centro de Convenciones",
      "Nombre": "Congreso de Innovación Tecnológica"
    },
    {
      "id_evento": "2",
      "Alcance": "Nacional",
      "Pais": "Colombia",
      "Ciudad": "Medellín",
      "Fecha": "2024-03-20",
      "Lugar": "Plaza Mayor",
      "Nombre": "Feria Nacional de Emprendimiento"
    },
    {
      "id_evento": "3",
      "Alcance": "Regional",
      "Pais": "Colombia",
      "Ciudad": "Cali",
      "Fecha": "2023-11-05",
      "Lugar": "Coliseo del Pueblo",
      "Nombre": "Expo Valle Innovación"
    }
  ]);
  
  // Obtener todos los Eventos
  db.Eventos.find().pretty();
  
  // Obtener un Evento por su _id
  db.Eventos.findOne({ _id: ObjectId("6701e0fdd887ee370357d713") });
  
  // Obtener un Evento por ciudad
  db.Eventos.findOne({ "Ciudad": "Medellín" });

    // Actualizar la ciudad de un evento
    db.Eventos.updateOne(
      { "Nombre": "Feria Nacional de Emprendimiento" },
      { $set: { "Ciudad": "Manizales" } }
    )
  
  // Eliminar un Evento por su _id
  db.Eventos.deleteOne({ _id: ObjectId("6701e0fdd887ee370357d713") });

  //Aggregations Eventos
  // Contar cuántos eventos por ciudad han tenido lugar
  [
    {
      $group:
        {
          _id: "$Ciudad",
          totalEventos: {
            $sum: 1
          }
        }
    }
  ]
  // Obtener la cantidad de eventos que tienen un alcance regional
  [
    {
      $match:
        {
          Alcance: "Regional"
        }
    },
    {
      $count:
        "totalEventosRegionales"
    }
  ]
  // Listar todos los eventos que han tenido lugar en el año 2024
  [
    {
      $match:
        {
          Fecha: {
            $gte: "2024-01-01",
            $lt: "2025-01-01"
          }
        }
    },
    {
      $project:
        {
          _id: 0,
          Nombre: 1,
          Fecha: 1,
          Ciudad: 1
        }
    }
  ]
  
  // 3. Colección: Participantes
  
  db.Participantes.insertMany([
    {
      "id": "1023456789",
      "Nombre": "Carlos Martinez",
      "Universidad": "Universidad Nacional",
      "equipos": [
        {
          "id_equipo": "9"
        },
        {
          "id_equipo": "2"
        }
      ]
    },
    {
      "id": "1145678901",
      "Nombre": "María López",
      "Universidad": "Pontificia Universidad Javeriana",
      "equipos": [
        {
          "id_equipo": "4"
        },
        {
          "id_equipo": "7"
        }
      ]
    },
    {
      "id": "1234567890",
      "Nombre": "Juan Pérez",
      "Universidad": "Universidad de los Andes",
      "equipos": [
        {
          "id_equipo": "7"
        },
        {
          "id_equipo": "6"
        }
      ]
    }
  ]);
  
  // Obtener tods los Participantes
  db.Participantes.find().pretty();
  
  // Obtener un Participante por su _id
  db.Participantes.findOne({ _id: ObjectId("6701e163d887ee370357d71e") });

  // Actualizar la universidad de un participante
  db.Participantes.updateOne(
    { "Nombre": "Juan Pérez" },
    { $set: { "Universidad": "Universidad del Valle" } }
  )
  
  // Eliminar un Participante por su _id
  db.Participantes.deleteOne({ _id: ObjectId("6701e163d887ee370357d71e") });

// Aggregations Participantes
// Contar cuántos estudiantes por universidad pertenecen a más de un equipo
[
  {
    $match:
      {
        "equipos.1": {
          $exists: true
        }
      }
  },
  {
    $group:
      {
        _id: "$Universidad",
        totalEstudiantes: {
          $sum: 1
        }
      }
  }
]
// Contar cuántos estudiantes por universidad pertenecen a más de un equipo
[
  {
    $lookup:
      {
        from: "Equipo",
        localField: "equipos.id_equipo",
        foreignField: "id_equipo",
        as: "equipos_info"
      }
  },
  {
    $unwind:
      {
        path: "$equipos_info"
      }
  },
  {
    $lookup:
      {
        from: "Eventos",
        localField:
          "equipos_info.eventos.id_evento",
        foreignField: "id_evento",
        as: "eventos_info"
      }
  },
  {
    $unwind:
      {
        path: "$eventos_info"
      }
  },
  {
    $match:
      {
        "equipos_info.Nombre":
          "Desarrolladores Elite"
      }
  },
  {
    $project:
      {
        _id: 0,
        Estudiante: "$Nombre",
        Evento: "$eventos_info.Nombre"
      }
  }
]
// Obtener los estudiantes que han participado en eventos con alcance nacional
[
  {
    $lookup:
      {
        from: "Equipo",
        localField: "equipos.id_equipo",
        foreignField: "id_equipo",
        as: "equipos_info"
      }
  },
  {
    $unwind:
      {
        path: "$equipos_info"
      }
  },
  {
    $lookup:
      {
        from: "Eventos",
        localField:
          "equipos_info.eventos.id_evento",
        foreignField: "id_evento",
        as: "eventos_info"
      }
  },
  {
    $unwind:
      {
        path: "$eventos_info"
      }
  },
  {
    $match:
      {
        "eventos_info.Alcance": "Nacional"
      }
  },
  {
    $project:
      {
        _id: 0,
        Nombre: 1,
        Universidad: 1,
        Evento: "$eventos_info.Nombre"
      }
  }
]
// Listar los nombres de los estudiantes y los eventos en los que han participado con el equipo "Desarrolladores Elite"
[
  {
    $lookup:
      {
        from: "Equipo",
        localField: "equipos.id_equipo",
        foreignField: "id_equipo",
        as: "equipos_info"
      }
  },
  {
    $unwind:
      {
        path: "$equipos_info"
      }
  },
  {
    $lookup:
      {
        from: "Eventos",
        localField:
          "equipos_info.eventos.id_evento",
        foreignField: "id_evento",
        as: "eventos_info"
      }
  },
  {
    $unwind:
      {
        path: "$eventos_info"
      }
  },
  {
    $match:
      {
        "equipos_info.Nombre":
          "Desarrolladores Elite"
      }
  },
  {
    $project:
      {
        _id: 0,
        Estudiante: "$Nombre",
        Evento: "$eventos_info.Nombre"
      }
  }
]
// Listar las universidades con estudiantes que pertenecen a equipos de la categoría "Avanzada"
[
  {
    $lookup:
      {
        from: "Equipo",
        localField: "equipos.id_equipo",
        foreignField: "id_equipo",
        as: "equipos_info"
      }
  },
  {
    $unwind:
      {
        path: "$equipos_info"
      }
  },
  {
    $match:
      {
        "equipos_info.Categoria": "Avanzada"
      }
  },
  {
    $group:
      {
        _id: "$Universidad",
        totalEstudiantes: {
          $sum: 1
        }
      }
  }
]
// Listar los estudiantes que han participado en eventos en la ciudad de "Medellín"
[
  {
    $lookup:
      {
        from: "Equipo",
        localField: "equipos.id_equipo",
        foreignField: "id_equipo",
        as: "equipos_info"
      }
  },
  {
    $unwind:
      {
        path: "$equipos_info"
      }
  },
  {
    $lookup:
      {
        from: "Eventos",
        localField:
          "equipos_info.eventos.id_evento",
        foreignField: "id_evento",
        as: "eventos_info"
      }
  },
  {
    $unwind:
      {
        path: "$eventos_info"
      }
  },
  {
    $match:
      {
        "eventos_info.Ciudad": "Medellín"
      }
  },
  {
    $project:
      {
        _id: 0,
        Nombre: 1,
        Universidad: 1
      }
  }
]