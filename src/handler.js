const books = require('./books');
const {nanoid} = require('nanoid');

//menyimpan buku
const addBookHandler = (request, h) =>{
    //ini didapatkan dari client
    const {name, year, author, summary, publisher, pageCount, readPage, reading }= request.payload;

    //ini cuma bisa diakses oleh server, jadi dibuat sendiri
    const id = nanoid(16);
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;

    //mengecek apakah buku sudah selesai dibaca
    finished = (readPage===pageCount);

    //menambahkan buku yang tidak ada nama
    if(name === undefined){
        const response = h.response({
            status:'fail',
            message:'Gagal menambahkan buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    //menambahkan buku yang halaman baca lebih besar dari jumlah halaman
    if(readPage>pageCount){
        const response =h.response({
            status:'fail',
            message:'Gagal menambahkan buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    const newBook = {
        id,
        name,
        year,
        author,
        summary,
        publisher,
        pageCount,
        readPage,
        finished,
        reading,
        insertedAt,
        updatedAt,
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
const getAllBooksHandler =(request, h) =>{
    const {name, reading, finished} = request.query;

    let bukudiFilter = books;

    if(name!== undefined){
        bukudiFilter=bukudiFilter.filter((book)=>book.name !==undefined && book.name.toLowerCase().includes(name.toLowerCase()));
    }

    if(reading !== undefined){
        const sudahBaca = Number.parseInt(reading, 10)===1;
        bukudiFilter = bukudiFilter.filter((book)=>book.reading===sudahBaca);
    }

    if(finished !== undefined){
        const sudahSelesai = Number.parseInt(finished, 10)=== 1;
        bukudiFilter = bukudiFilter.filter((book)=> book.finished===sudahSelesai);
    }

    const response= h.response({
        status:'success',
        data : {
            books: bukudiFilter.map((book)=>({
                id: book.id,
                name: book.name,
                publisher: book.publisher,
            })),
        },
    });
    response.code(200);
    return response;
}

//mengambil buku tertentu atau berdasarkan id
const getBookByIdHandler = (request, h) => {
    //mendapatkan dahulu id dari request param
    const {id}= request.params;
    //mendapatkan objek note dengan id tsbt berdasarkan object array books
    const book = books.filter((n)=> n.id===id)[0];

    if(book!==undefined){
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
};

//mengubah buku berdasarkan id
const editBookByIdHandler = (request, h)=>{
    const {id} = request.params;

    //dpatkan data notes terbaru yang dikirimkan client dengan body request
    const { name, year, author, summary, publisher, pageCount, readPage, reading } = request.payload;
    const insertedAt = new Date().toISOString();
    const updatedAt = insertedAt;
    const finished = (readPage===pageCount);

    //menambahkan buku yang tidak ada nama
    if(name === undefined){
        const response = h.response({
            status:'fail',
            message:'Gagal memperbarui buku. Mohon isi nama buku',
        });
        response.code(400);
        return response;
    }

    //menambahkan buku yang halaman baca lebih besar dari jumlah halaman
    if(readPage>pageCount){
        const response =h.response({
            status:'fail',
            message:'Gagal memperbarui buku. readPage tidak boleh lebih besar dari pageCount',
        });
        response.code(400);
        return response;
    }

    //mendapatkan index array pada object buku sesuai id yang ditentukan
    const index= books.findIndex((book)=>book.id===id);

    //bila ditemukan maka index bernilai array index jika tidak index bernilai 1
    if(index !== -1){
        books[index]={
            ...books[index],
            name,
            year,
            author,
            summary,
            publisher,
            pageCount,
            readPage,
            reading,
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

module.exports={addBookHandler, getAllBooksHandler, 
    getBookByIdHandler, editBookByIdHandler, deleteBookByIdHandler};