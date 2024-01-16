import express, { Request, Response } from "express";
import cors from "cors";
import { db } from "./database/knex";

const app = express();

app.use(cors());
app.use(express.json());

app.listen(3003, () => {
  console.log(`Servidor rodando na porta ${3003}`);
});

app.get("/ping", async (req: Request, res: Response) => {
  try {
    res.status(200).send({ message: "Pong!" });
  } catch (error) {
    console.log(error);

    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

// getAllBands
app.get("/bands", async (req: Request, res: Response) => {
  try {
    const result = await db.raw(`
        SELECT * FROM bands;
    `);

    res.status(200).send(result);
  } catch (error) {
    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

// createNewBand
app.post("/bands", async (req: Request, res: Response) => {
  try {
    const id = req.body.id;
    const name = req.body.name;
    if (!id || !name) {
      res.status(400);
      throw new Error("Dados inválidos. Deve passar um 'id' e um 'name'");
    }

    if (typeof id !== "string") {
      res.status(400);
      throw new Error("'id' inválido, deve ser string");
    }

    if (typeof name !== "string") {
      res.status(400);
      throw new Error("'name' inválido, deve ser string");
    }

    await db.raw(`
        INSERT INTO bands (id, name)
        VALUES ("${id}", "${name}")
    `);

    res.status(201).send("Banda cadastrada com sucesso!");
  } catch (error) {
    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

// editBand
app.put("/bands/:id", async (req: Request, res: Response) => {
  try {
    const id = req.params.id;
    const newName = req.body.name;

    if (!newName) {
      res.status(400);
      throw new Error("'name' deve ser passado no body");
    }

    if (!newName !== undefined) {
      if (typeof newName !== "string") {
        res.status(400);
        throw new Error("'name' deve ser string");
      }
    }

    const [band] = await db.raw(`
          SELECT * FROM bands
          WHERE id = "${id}";
    `);

    if (band) {
        await db.raw(`
            UPDATE bands
            SET name = "${newName}"
            WHERE id = "${id}";
        `)
    } else {
        res.status(404);
        throw new Error("'id' não encontrado");
    }

    res.status(201).send("Atualização realizada com sucesso!");
  } catch (error) {
    if (req.statusCode === 200) {
      res.status(500);
    }

    if (error instanceof Error) {
      res.send(error.message);
    } else {
      res.send("Erro inesperado");
    }
  }
});

// getAllSongs
app.get("/songs", async (req: Request, res: Response) => {
    try {
      const result = await db.raw(`
          SELECT * FROM songs;
      `);
  
      res.status(200).send(result);
    } catch (error) {
      if (req.statusCode === 200) {
        res.status(500);
      }
  
      if (error instanceof Error) {
        res.send(error.message);
      } else {
        res.send("Erro inesperado");
      }
    }
  });

// createNewSong
app.post("/songs", async (req: Request, res: Response) => {
    try {
      const id = req.body.id;
      const name = req.body.name;
      const band_id = req.body.band_id
      if (!id || !name || !band_id) {
        res.status(400);
        throw new Error("Dados inválidos. Deve passar um 'id', um 'name' e um 'band_id'");
      }
  
      if (typeof id !== "string") {
        res.status(400);
        throw new Error("'id' inválido, deve ser string");
      }
  
      if (typeof name !== "string") {
        res.status(400);
        throw new Error("'name' inválido, deve ser string");
      }

      if (typeof band_id !== "string") {
        res.status(400);
        throw new Error("'band_id' inválido, deve ser string");
      }
  
      const [band] = await db.raw(`
        SELECT * FROM bands
        WHERE id = "${band_id}"
      `)

      if(band) {
        await db.raw(`
            INSERT INTO songs (id, name, band_id)
            VALUES ("${id}", "${name}", "${band_id}")
        `);
        res.status(201).send("Música cadastrada com sucesso!")
      } else {
        res.statusCode = 404;
        throw new Error("'band_id' não encontrado");
      }

    } catch (error) {
      if (req.statusCode === 200) {
        res.status(500);
      }
  
      if (error instanceof Error) {
        res.send(error.message);
      } else {
        res.send("Erro inesperado");
      }
    }
  });

// editSong
app.put("/songs/:id", async (req: Request, res: Response) => {
    try {
      const id = req.params.id;
      const newName = req.body.name;

  
      if (!newName) {
        res.status(400);
        throw new Error("'name' deve ser passado no body");
      }
  
      if (!newName !== undefined) {
        if (typeof newName !== "string") {
          res.status(400);
          throw new Error("'name' deve ser string");
        }
      }
  
      const [song] = await db.raw(`
            SELECT * FROM songs
            WHERE id = "${id}";
      `);
  
      if (song) {
          await db.raw(`
              UPDATE songs
              SET name = "${newName}"
              WHERE id = "${id}";
          `)
      } else {
          res.status(404);
          throw new Error("'id' não encontrado");
      }
  
      res.status(201).send("Atualização realizada com sucesso!");
    } catch (error) {
      if (req.statusCode === 200) {
        res.status(500);
      }
  
      if (error instanceof Error) {
        res.send(error.message);
      } else {
        res.send("Erro inesperado");
      }
    }
  });