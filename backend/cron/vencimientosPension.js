const schedule = require('node-schedule');
const { Cobro, Pension } = require('../models/assosiation');
const PersonaP = require('../models/personasP');
schedule.scheduleJob('*/5 * * * * *', async () => {
    const cob = await Cobro.findAll({where:{estado:false}});
    if(!cob)
        return false;
    cob.map(async (c)=>{
        const tel = await Pension.findAll({
            attributes:["idPension"],
            where:{idPension:c.idPension},
            include:[
                {
                    model:PersonaP,
                    as:"PersonaP",
                    attributes:["telefono"]
                }
            ]
        });
        console.log(tel.PersoanP.telfeno)
    })
});