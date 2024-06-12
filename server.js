const express = require('express')
const joyas = require('./data/joyas.js')
const e = require('express')
const app = express()
app.listen(3000, () => console.log('Your app listening on port 3000'))

app.get('/', (req, res) => {
  res.send('Oh wow! this is working =)')
})


function HATEOASV2(joyas) {
  return joyas.results.map(joya => ({
    ...joya,
    links: [
      {
        rel: 'self',
        href: `/joyas/${joya.id}`
      },
      {
        rel: 'collection',
        href: '/joyas'
      },
      {
        rel: 'category',
        href: `/joyas?category=${joya.category}`
      }
    ]
  }));
}

app.get("/joyas", (req, res) => {
  try {
    const joyasLinks = HATEOASV2(joyas);
    let {fields} = req.query
      if(fields){
        const joyasFiltradas = joyas.results.filter(joya => {
            for (let key in fields) {
              if (joya[key] == undefined || joya[key].toString() !== fields[key]) {
                return false;
              }
            }
            return true;
          });
          res.json(joyasFiltradas)
      }else{
        res.json(joyasLinks);
      }  
  } catch (error) {
    console.log(error.message);
    res.status(500).send(error.message);
  }
});

app.get("/joyas/categoria/:categoria", (req, res) => {
    try {
      let joyasFiltradas = []
      let {categoria} = req.params
      joyas.results.filter((joya) =>{
        if(joya.category == categoria){
            joyasFiltradas.push(joya)
        }
      })
      res.json(joyasFiltradas)
    } catch (error) {
      console.log(error.message);
      res.status(500).send(error.message);
    }
  });

  app.get("/joyas/:id", (req, res) => {
    try {
        let joyaEncontrada = joyas.results.find((joya)=>{
            if(joya.id == req.params.id){
                res.json(joya)
            }else{
                res.json("No existe la joya con ese id")
            }
        })
    } catch (error) {
      console.log(error.message);
      res.status(500).send(error.message);
    }
  });

  app.get("/api/joyas", (req, res) => {
    const { values } = req.query;
    if (values == "asc") return res.send(orderValues("asc"));
    if (values == "desc") return res.send(orderValues("desc"));
 
    if (req.query.page) {

    const { page } = req.query;

    return res.send({ joyas: HATEOASV2(joyas).slice(page * 2 - 2, page * 2) });
    }
    res.send({
    joyas: HATEOASV2(joyas),
    });
    });



