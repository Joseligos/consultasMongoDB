
// 1. Colección: Equipo

// Insertar Equipos
db.Equipo.insertMany([
    {
      "Nombre": "Los Innovadores",
      "Categoria": "Avanzada",
      "eventos": [
    {
      "_id": {
        "$oid": "6701dbabd887ee370357d6ca"
      },
      "Alcance": "Internacional",
      "Pais": "Colombia",
      "Ciudad": "Bogotá",
      "Fecha": "2023-09-15",
      "Lugar": "Centro de Convenciones",
      "Nombre": "Congreso de Innovación Tecnológica"
    },
    {
      "_id": {
        "$oid": "6701dbabd887ee370357d6cf"
      },
      "Alcance": "Regional",
      "Pais": "Colombia",
      "Ciudad": "Bucaramanga",
      "Fecha": "2023-10-12",
      "Lugar": "Auditorio UIS",
      "Nombre": "Jornadas de Innovación y Tecnología"
    }
    ],
      "participantes": [
    {
      "_id": {
        "$oid": "6701da63d887ee370357d6b8"
      },
      "id": "1098765432",
      "Nombre": "Laura Sánchez",
      "Universidad": "Universidad de Antioquia"
    },
    {
      "_id": {
        "$oid": "6701da63d887ee370357d6bc"
      },
      "id": "1198765432",
      "Nombre": "Jorge Orozco",
      "Universidad": "Universidad EAFIT"
    }
    ]
    },
    {
      "Nombre": "Creadoras del Futuro",
      "Categoria": "Principiante",
      "eventos": [
    {
      "_id": {
        "$oid": "6701dbabd887ee370357d6cb"
      },
      "Alcance": "Nacional",
      "Pais": "Colombia",
      "Ciudad": "Medellín",
      "Fecha": "2024-03-20",
      "Lugar": "Plaza Mayor",
      "Nombre": "Feria Nacional de Emprendimiento"
    },
    {
      "_id": {
        "$oid": "6701dbabd887ee370357d6d1"
      },
      "Alcance": "Nacional",
      "Pais": "Colombia",
      "Ciudad": "Cartagena",
      "Fecha": "2024-08-30",
      "Lugar": "Centro de Convenciones Julio César Turbay",
      "Nombre": "Foro Nacional de Salud y Bienestar"
    }
    ],
    "participantes": [
    {
      "_id": {
        "$oid": "6701da63d887ee370357d6b3"
      },
      "id": "1023456789",
      "Nombre": "Carlos Martinez",
      "Universidad": "Universidad Nacional"
    },
    {
      "_id": {
        "$oid": "6701da63d887ee370357d6b8"
      },
      "id": "1098765432",
      "Nombre": "Laura Sánchez",
      "Universidad": "Universidad de Antioquia"
    },
    {
      "_id": {
        "$oid": "6701da63d887ee370357d6bb"
      },
      "id": "1098765432",
      "Nombre": "Daniela Ruiz",
      "Universidad": "Universidad Tecnológica de Pereira"
    }
    ]
    },
    {
      "Nombre": "Visionarios Tech",
      "Categoria": "Avanzada",
      "eventos": [
        {
          "_id": {
            "$oid": "6701dbabd887ee370357d6cc"
          },
          "Alcance": "Regional",
          "Pais": "Colombia",
          "Ciudad": "Cali",
          "Fecha": "2023-11-05",
          "Lugar": "Coliseo del Pueblo",
          "Nombre": "Expo Valle Innovación"
        },
        {
          "_id": {
            "$oid": "6701dbabd887ee370357d6d0"
          },
          "Alcance": "Internacional",
          "Pais": "México",
          "Ciudad": "Ciudad de México",
          "Fecha": "2024-05-22",
          "Lugar": "Palacio de los Deportes",
          "Nombre": "Cumbre Internacional de Negocios"
        }
      ],
      "participantes": [
        {
          "_id": {
            "$oid": "6701da63d887ee370357d6ba"
          },
          "id": "1156789012",
          "Nombre": "Carolina Ramírez",
          "Universidad": "Universidad del Norte"
        }
      ]
    }
  ]);
  
  // Obtener todos los Equipos
  db.Equipo.find().pretty();
  
  // Obtener un Equipo por su _id
  db.Equipo.findOne({ _id: ObjectId("6701e012d887ee370357d6f2") });
  
  // Obtener un Equipo por su categoria
  db.Equipo.findOne({ "Categoria": "Avanzada" });

  // Actualizar la categoria de un equipo 
  db.Equipo.updateOne(
    { "Nombre": "Visionarios Tech" },
    { $set: { "Categoria": "Principiante" } }
  )  
  
  // Eliminar un Equipo por su _id
  db.Equipo.deleteOne({ _id: ObjectId("6701e012d887ee370357d6f2") });
  
  // Agreggations en Equipo
  // Consultar todos los equipos de categoría "Avanzada" que han participado en eventos internacionales
  [
    {
      $match:
        {
          Categoria: "Avanzada"
        }
    },
    {
      $unwind:
        {
          path: "$eventos"
        }
    },
    {
      $match:
        {
          "eventos.Alcance": "Internacional"
        }
    },
    {
      $project:
        {
          Nombre: 1,
          "eventos.Nombre": 1,
          "eventos.Pais": 1,
          "eventos.Ciudad": 1
        }
    }
  ]
  // Obtener la cantidad de eventos por equipo
  [
    {
      $project:
        {
          Nombre: 1,
          numEventos: {
            $size: "$eventos"
          }
        }
    }
  ]
  // Listar los equipos que tienen participantes de la "Universidad de Antioquia"
  [
    {
      $unwind:
        {
          path: "$participantes"
        }
    },
    {
      $match:
        {
          "participantes.Universidad":
            "Universidad de Antioquia"
        }
    },
    {
      $group:
        {
          _id: "$Nombre",
          participantes: {
            $push: "$participantes.Nombre"
          }
        }
    }
  ]
  // Contar cuántos equipos participan por ciudad
  [
    {
      $unwind:
        {
          path: "$eventos"
        }
    },
    {
      $group:
        {
          _id: "$eventos.Ciudad",
          numEquipos_Participantes: {
            $sum: 1
          }
        }
    }
  ]
  // Obtener los eventos de tipo "Nacional" donde participaron equipos de categoría "Principiante"
  [
    {
      $match:
        {
          Categoria: "Principiante"
        }
    },
    {
      $unwind:
        {
          path: "$eventos"
        }
    },
    {
      $match:
        {
          "eventos.Alcance": "Nacional"
        }
    },
    {
      $project:
        {
          Nombre: 1,
          "eventos.Nombre": 1,
          "eventos.Ciudad": 1,
          "eventos.Fecha": 1
        }
    }
  ]
  // Consultar el número total de participantes por equipo
  [
    {
      $project:
        {
          Nombre: 1,
          numParticipantes: {
            $size: "$participantes"
          }
        }
    }
  ]
  
  
  // 2. Colección: Eventos
  
  // Insertar Eventos
  db.Eventos.insertMany([
    {
      "Alcance": "Internacional",
      "Pais": "Colombia",
      "Ciudad": "Bogotá",
      "Fecha": "2023-09-15",
      "Lugar": "Centro de Convenciones",
      "Nombre": "Congreso de Innovación Tecnológica",
      "equipos": [
        {
          "_id": {
            "$oid": "6701e02fd887ee370357d6fc"
          },
          "Nombre": "Desarrolladores Elite",
          "Categoria": "Avanzada"
        }
      ]
    },
    {
      "Alcance": "Nacional",
      "Pais": "Colombia",
      "Ciudad": "Medellín",
      "Fecha": "2024-03-20",
      "Lugar": "Plaza Mayor",
      "Nombre": "Feria Nacional de Emprendimiento",
      "equipos": [
        {
          "_id": {
            "$oid": "6701e02fd887ee370357d6f9"
          },
          "Nombre": "Creadoras del Futuro",
          "Categoria": "Principiante"
        }
      ]
    },
    {
      "Alcance": "Regional",
      "Pais": "Colombia",
      "Ciudad": "Cali",
      "Fecha": "2023-11-05",
      "Lugar": "Coliseo del Pueblo",
      "Nombre": "Expo Valle Innovación",
      "equipos": [
        {
          "_id": {
            "$oid": "6701e02fd887ee370357d6fa"
          },
          "Nombre": "Visionarios Tech",
          "Categoria": "Avanzada"
        }
      ]
    }
  ]);
  
  // Obtener todos los Eventos
  db.Eventos.find().pretty();
  
  // Obtener un Enveto por su _id
  db.Eventos.findOne({ _id: ObjectId("6701dbabd887ee370357d6ca") });
  
  // Obtener un Evento por ciudad
  db.Eventos.findOne({ "Ciudad": "Bogotá" });

  // Actualizar la ciudad de un evento
  db.Eventos.updateOne(
    { "Nombre": "Feria Nacional de Emprendimiento" },
    { $set: { "Ciudad": "Manizales" } }
  )
  
  // Eliminar un Evento por su _id
  db.Eventos.deleteOne({ _id: ObjectId("6701dbabd887ee370357d6ca") });
  
  // Aggregations Eventos
  // Contar cuántos eventos se han realizado en cada país
  [
    {
      $group:
        {
          _id: "$Pais",
          numEventos: {
            $sum: 1
          }
        }
    }
  ]
  // Obtener el evento más reciente en cada país
  [
    {
      $group:
        {
          _id: "$Pais",
          eventoReciente: {
            $max: "$Fecha"
          }
        }
    }
  ]
  
  
  // 3. Colección: Participantes
  
  db.Participantes.insertMany([
    {
      "_id": {
        "$oid": "6701da63d887ee370357d6b3"
      },
      "id": "1023456789",
      "Nombre": "Carlos Martinez",
      "Universidad": "Universidad Nacional",
      "equipos": [
        {
          "_id": {
            "$oid": "670311553edfd1276998c8ef"
          },
          "Nombre": "Innovación Extrema",
          "Categoria": "Avanzada"
        },
        {
          "_id": {
            "$oid": "6701e02fd887ee370357d6f9"
          },
          "Nombre": "Creadoras del Futuro",
          "Categoria": "Principiante"
        }
      ]
    },
    {
      "_id": {
        "$oid": "6701da63d887ee370357d6b4"
      },
      "id": "1145678901",
      "Nombre": "María López",
      "Universidad": "Pontificia Universidad Javeriana",
      "equipos": [
        {
          "_id": {
            "$oid": "6701e02fd887ee370357d6fb"
          },
          "Nombre": "Pioneros Digitales",
          "Categoria": "Principiante"
        },
        {
          "_id": {
            "$oid": "670311553edfd1276998c8ed"
          },
          "Nombre": "Programadores de Impacto",
          "Categoria": "Avanzada"
        }
      ]
    },
    {
      "_id": {
        "$oid": "6701da63d887ee370357d6b6"
      },
      "id": "1109876543",
      "Nombre": "Ana Gómez",
      "Universidad": "Universidad del Valle",
      "equipos": [
        {
          "_id": {
            "$oid": "670311553edfd1276998c8f0"
          },
          "Nombre": "Desafío Digital",
          "Categoria": "Principiante"
        },
        {
          "_id": {
            "$oid": "670311553edfd1276998c8ef"
          },
          "Nombre": "Innovación Extrema",
          "Categoria": "Avanzada"
        }
      ]
    },
  ]);
  
  // Obtener todos los Participantes
  db.Participantes.find().pretty();
  
  // Obtener un Participante por su _id
  db.Participantes.findOne({ _id: ObjectId("6701da63d887ee370357d6b3") });

  // Actualizar la universidad de un participante
  db.Participantes.updateOne(
    { "Nombre": "Juan Pérez" },
    { $set: { "Universidad": "Universidad del Valle" } }
  )
  
  // Eliminar un Participante por su _id
  db.Participantes.deleteOne({ _id: ObjectId("6701da63d887ee370357d6b3") });
  