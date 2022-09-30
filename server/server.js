const mongoose = require('mongoose')
const Document = require('./schema/Document')

mongoose.connect('mongodb://localhost/rdocs')

const findOrCreateDocument = async docId => {
    if (docId === null) return

    const document = await Document.findById(docId)
    if (document) return document

    return await Document.create({_id: docId, data: ''})
}

const io = require('socket.io')(3001, {
    cors: {
        origin: 'http://localhost:3000',
        methods: ['GET', 'POST']
    }
})

io.on('connection', socket => {
    socket.on('get-document', async docId => {
        const document = await findOrCreateDocument(docId)
        
        socket.join(docId)
        socket.emit('load-document', document.data)

        socket.on('send-changes', delta => {
            socket.broadcast.to(docId).emit('receive-changes', delta)
        })

        socket.on('save-document', async data => {
            await Document.findByIdAndUpdate(docId, { data })
        })
    })
})