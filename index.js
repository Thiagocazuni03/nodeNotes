const readline = require('node:readline');
const fs = require('node:fs');
const operations = getOperations();
const rl = readline.createInterface({ input: process.stdin, output: process.stdout });
 
setOperation()

function setOperation(){
    rl.question(`Qual operação deseja fazer?\n 1. Criar nova anotação \n 2. Visualizar anotação \n 3. Visualizar lista \n 4. Excluir anotação\n 5. Encerrar Programa\n`, async(answer) => {
        try {
            let message = null
            switch (parseInt(answer)) {
                case 1:
                    message = await operations.create();
                    rl.write(message + '\n')
                    break;
                case 2:
                    message = await operations.show();
                    rl.write(message + '\n')
                    break;
                case 3:
                    let list = await operations.list();
                    
                    rl.write('Listando arquivos no diretório /notes \n')
                    list.forEach((f)=>{
                        rl.write('* '+ f + '\n')
                    })
                    
                    break; 
                case 4:
                    message = await operations.delete();
                    rl.write(message + '\n')
                    break;
                    case 5:
                        rl.close()
                        process.exit()
                    break;
                default:
                    throw new Error('Você não escolheu uma opção válida')
            }
            
        } catch (err) {
            console.error(err.message);
        }
        finally{
            setOperation()
        }
         
    });
}
 
function getOperations() {
    return {
        create: function () {
            return new Promise((res, rej)=>{
                rl.question('Certo, nos informe qual será a anotação:\n', (answer) => {
                    let archiveName = generateRandomString(5);
    
                    if (!fs.existsSync('./notes')) {
                        fs.mkdirSync('./notes');
                    }
    
                    fs.writeFile(`./notes/${archiveName}.txt`, answer, 'utf-8', (err) => {
                        if (err) {
                            rej({message:'Erro ao criar o arquivo:' + err.message});
                        } else {
                            res(`Arquivo ${archiveName} criado com sucesso!`);
                        } 
                        rl.close();
                    });
                });
            })
        },
        delete: function (name) {
            return new Promise((res, rej)=>{
                rl.question('Certo, nos informe qual arquivo voce deseja excluir, passando o nome e sua extenção:\n', (id) => {
                    fs.unlink(`./notes/${id}`,(err)=>{
                        err & (()=>rej({message:err}))
                        res(`O Arquivo ${id} foi excluido com sucesso!`)
                    })
                }) 
            })
        },
        show: function () {
            return new Promise((res, rej)=>{
                rl.question('Certo, nos informe qual arquivo voce deseja visualizar, passando o nome e sua extenção:\n', (id) => {
                    
                    if(fs.existsSync(`./notes/${id}`)){
                        fs.readFile(`./notes/${id}`, 'utf-8', (err, data)=>{
                            err && (()=> { 
                                rej({message:`Não foi possível ler o arquivo ${id}`}) 
                                setOperation()
                            })
                            res(data)
                        })
                    } else {
                        rej({message:`O arquivo ${id} não existe`})
                    }  
                })
            })
        },
        list: function () {
            return new Promise((res, rej) => {
                fs.readdir('./notes', (err, files)=>{
                    if(err){
                        rej({message:'não foi possível ler os arquivos deste diretório'})
                    } else {
                        res(files)
                    }
                })
            })
        }
    };
}

function generateRandomString(length) {
    const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
    let result = '';

    for (let i = 0; i < length; i++) {
        const randomIndex = Math.floor(Math.random() * characters.length);
        result += characters.charAt(randomIndex);
    }

    return result;
}

