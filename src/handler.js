const books = require('./books');
const {nanoid} = require('nanoid');

//menyimpan buku
const saveBookHandler = (request, h) =>{
    //ini didapatkan dari client
    const {title, authors, publisher, publishyear, pages, description }= request.payload;

    //ini cuma bisa diakses oleh server, jadi dibuat sendiri
    const id = nanoid(12);
    const createdAt = new Date().toISOString();
    const updatedAt = createdAt;

    const newBook = {
        title, authors, publisher, publishyear, pages, description, id, createdAt, updatedAt,
    };

    //masukkan nilai nya dengan push
    books.push(newBook);

    //mengetahui apakah newBook sudah masuk ke array book
    const isSuccess = books.filter((book)=> book.id).length>0;

    //gunakan response untuk menentukan response berhasil
    if (isSuccess){
        const response = h.response({
            status: 'success',
            message: 'Buku berhasil ditambahkan',
            data: {
                bookId: id,
            },
        });
        response.code(201);
        return response;
    }

    const response=h.response({
        status:'fail',
        message:'Buku gagal ditambahkan',
    });
    response.code(500);
    return response;

};


//mengambil seluruh buku
const getAllBooksHandler =()=>({
    status:'success',
    data: {
        books,
    },
});

//mengambil buku tertentu atau berdasarkan id
const getBookByIdHandler = (request, h) => {
    //mendapatkan dahulu id dari request param
    const {id}= request.params;
    //mendapatkan objek note dengan id tsbt berdasarkan object array books
    const book = books.filter((n)=> n.id===id)[0];

    if(note!==undefined){
        return{
            status:'success',
            data: {
                book,
            },
        };
    }

    const response = h.response({
        status:'fail',
        message:'Buku tidak ditemukan',
    });
    response.code(404);
    return response;
}

//mengubah buku berdasarkan id
const editBookByIdHandler = (request, h)=>{
    const {id} = request.params;

    //dpatkan data notes terbaru yang dikirimkan client dengan body request
    const { title, authors, publisher, publishyear, pages, description  } = request.payload;
    const updatedAt = new Date().toISOString();

    //mendapatkan index array pada object buku sesuai id yang ditentukan
    const index= books.findIndex((book)=>book.id===id);

    //bila ditemukan maka index bernilai array index jika tidak index bernilai 1
    if(index !== -1){
        books[index]={
            ...books[index],
            title, 
            authors, 
            publisher, 
            publishyear, 
            pages, 
            description, 
            updatedAt,
        };
        const response = h.response({
            status:'success',
            message:'Buku berhasil diperbarui',
        });
        response.code(200);
        return response;
    }
    const response=h.response({
        status:'fail',
        message:'Gagal memperbarui buku. Id tidak ditemukan',
    })
    response.code(404);
    return response;


}

//menghapus buku berdasarkan id
const deleteBookByIdHandler = (request, h)=>{
    const {id}=request.params;
    //dapatkan index dari object catatan sesuai dengan id yang didapat
    const index = books.findIndex((book)=> book.id===id);

    //cek index, kalau index tidak ada maka bernilai -1
    if(index !== -1){
        books.splice(index,1);
        const response= h.response({
            status:'success',
            message:'Buku berhasil dihapus'
        });
        response.code(200);
        return response;
    }
    const response= h.response({
        status:'fail',
        message:'Buku gagal dihapus. Id tidak ditemukan'
    });
    response.code(404);
    return response;
};

module.exports={saveBookHandler, getAllBooksHandler, 
    getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler};