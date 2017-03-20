var articlesService = (function () {
    "use strict";
    var articles = [
        {
            id: '1',
            title: 'Канадская теннисистка сходила на свидание с болельщиком, которому проспорила в Твиттере',
            summary: 'T44-ая ракетка мира согласилась провести время с фанатом, если клуб «Нью-Инглэнд Пэтриотс» станет победителем Супербоула.',
            createdAt: new Date('2001-02-27T23:00:00'),
            author: 'Иван',
            content: 'T44-ая ракетка мира согласилась провести время с фанатом, если клуб «Нью-Инглэнд Пэтриотс» станет победителем Супербоула.T44-ая ракетка мира согласилась провести время с фанатом, если клуб «Нью-Инглэнд Пэтриотс» станет победителем Супербоула.',
            tags: ["music", "usa"]
        },
        {
            id: '2',
            title: 'Видеоблогер PewDiePie выпустил ролик с извинениями за антисемитские шутки',
            summary: 'В нём он также заявил, что СМИ выдрали его слова из контекста.',
            createdAt: new Date('2002-02-27T23:00:00'),
            author: 'Иванов Иван',
            content: 'В нём он также заявил, что СМИ выдрали его слова из контекста.В нём он также заявил, что СМИ выдрали его слова из контекста.',
            tags: ["music"]
        },
        {
            id: '3',
            title: 'Минское «Динамо» обыграло ярославский «Локомотив»',
            summary: 'Минское «Динамо» обыграло ярославский «Локомотив» в четвертом матче первого раунда плей-офф КХЛ — 4:2',
            createdAt: new Date('2003-02-27T23:00:00'),
            author: 'Иванов Петр',
            content: 'Гости создали больше опасных моментов и в два раза перебросали минчан, но «зубры» на этот раз очень эффективно использовали свои моменты.',
            tags: ["music", "super"]
        },
        {
            id: '4',
            title: 'Минское «Динамо» обыграло ярославский «Локомотив»',
            summary: 'Минское «Динамо» обыграло ярославский «Локомотив» в четвертом матче первого раунда плей-офф КХЛ — 4:2',
            createdAt: new Date('2004-02-27T23:00:00'),
            author: 'Иванов Иван',
            content: 'Гости создали больше опасных моментов и в два раза перебросали минчан, но «зубры» на этот раз очень эффективно использовали свои моменты.',
            tags: ["usa"]
        },
        {
            id: '5',
            title: 'Минское «Динамо» обыграло ярославский «Локомотив»',
            summary: 'Минское «Динамо» обыграло ярославский «Локомотив» в четвертом матче первого раунда плей-офф КХЛ — 4:2',
            createdAt: new Date('2005-02-27T23:00:00'),
            author: 'Некий человек',
            content: 'Гости создали больше опасных моментов и в два раза перебросали минчан, но «зубры» на этот раз очень эффективно использовали свои моменты.',
            tags: ["music"]
        },
        {
            id: '6',
            title: 'Минское «Динамо» обыграло ярославский «Локомотив»',
            summary: 'Минское «Динамо» обыграло ярославский «Локомотив» в четвертом матче первого раунда плей-офф КХЛ — 4:2',
            createdAt: new Date('2006-02-27T23:00:00'),
            author: 'Иванов Иван',
            content: 'Гости создали больше опасных моментов и в два раза перебросали минчан, но «зубры» на этот раз очень эффективно использовали свои моменты.',
            tags: ["music", "usa"]
        },
        {
            id: '7',
            title: 'Минское «Динамо» обыграло ярославский «Локомотив»',
            summary: 'Минское «Динамо» обыграло ярославский «Локомотив» в четвертом матче первого раунда плей-офф КХЛ — 4:2',
            createdAt: new Date('2007-02-27T23:00:00'),
            author: 'Илья Сидоров',
            content: 'Гости создали больше опасных моментов и в два раза перебросали минчан, но «зубры» на этот раз очень эффективно использовали свои моменты.',
            tags: ["music", "usa"]
        },
        {
            id: '8',
            title: 'Минское «Динамо» обыграло ярославский «Локомотив»',
            summary: 'Минское «Динамо» обыграло ярославский «Локомотив» в четвертом матче первого раунда плей-офф КХЛ — 4:2',
            createdAt: new Date('2008-02-27T23:00:00'),
            author: 'Илья Сидоров',
            content: 'Гости создали больше опасных моментов и в два раза перебросали минчан, но «зубры» на этот раз очень эффективно использовали свои моменты.',
            tags: ["music", "usa"]
        },
        {
            id: '9',
            title: 'Минское «Динамо» обыграло ярославский «Локомотив»',
            summary: 'Минское «Динамо» обыграло ярославский «Локомотив» в четвертом матче первого раунда плей-офф КХЛ — 4:2',
            createdAt: new Date('2009-02-27T23:00:00'),
            author: 'Иван',
            content: 'Гости создали больше опасных моментов и в два раза перебросали минчан, но «зубры» на этот раз очень эффективно использовали свои моменты.',
            tags: ["music", "usa"]
        },
        {
            id: '10',
            title: 'Минское «Динамо» обыграло ярославский «Локомотив»',
            summary: 'Минское «Динамо» обыграло ярославский «Локомотив» в четвертом матче первого раунда плей-офф КХЛ — 4:2',
            createdAt: new Date('2010-02-27T23:00:00'),
            author: 'Иванов Иван',
            content: 'Гости создали больше опасных моментов и в два раза перебросали минчан, но «зубры» на этот раз очень эффективно использовали свои моменты.',
            tags: ["music", "usa"]
        },
        {
            id: '11',
            title: 'Канадская теннисистка сходила на свидание с болельщиком, которому проспорила в Твиттере',
            summary: 'T44-ая ракетка мира согласилась провести время с фанатом, если клуб «Нью-Инглэнд Пэтриотс» станет победителем Супербоула.',
            createdAt: new Date('2011-02-27T23:00:00'),
            author: 'Иван',
            content: 'T44-ая ракетка мира согласилась провести время с фанатом, если клуб «Нью-Инглэнд Пэтриотс» станет победителем Супербоула.T44-ая ракетка мира согласилась провести время с фанатом, если клуб «Нью-Инглэнд Пэтриотс» станет победителем Супербоула.',
            tags: ["music", "usa"]
        },
        {
            id: '12',
            title: 'Видеоблогер PewDiePie выпустил ролик с извинениями за антисемитские шутки',
            summary: 'В нём он также заявил, что СМИ выдрали его слова из контекста.',
            createdAt: new Date('2012-02-27T23:00:00'),
            author: 'Иванов Иван',
            content: 'В нём он также заявил, что СМИ выдрали его слова из контекста.В нём он также заявил, что СМИ выдрали его слова из контекста.',
            tags: ["music"]
        },
        {
            id: '13',
            title: 'Минское «Динамо» обыграло ярославский «Локомотив»',
            summary: 'Минское «Динамо» обыграло ярославский «Локомотив» в четвертом матче первого раунда плей-офф КХЛ — 4:2',
            createdAt: new Date('2013-02-27T23:00:00'),
            author: 'Иванов Петр',
            content: 'Гости создали больше опасных моментов и в два раза перебросали минчан, но «зубры» на этот раз очень эффективно использовали свои моменты.',
            tags: ["music", "super"]
        },
        {
            id: '14',
            title: 'Минское «Динамо» обыграло ярославский «Локомотив»',
            summary: 'Минское «Динамо» обыграло ярославский «Локомотив» в четвертом матче первого раунда плей-офф КХЛ — 4:2',
            createdAt: new Date('2014-02-27T23:00:00'),
            author: 'Иванов Иван',
            content: 'Гости создали больше опасных моментов и в два раза перебросали минчан, но «зубры» на этот раз очень эффективно использовали свои моменты.',
            tags: ["usa"]
        },
        {
            id: '15',
            title: 'Минское «Динамо» обыграло ярославский «Локомотив»',
            summary: 'Минское «Динамо» обыграло ярославский «Локомотив» в четвертом матче первого раунда плей-офф КХЛ — 4:2',
            createdAt: new Date('2015-02-27T23:00:00'),
            author: 'Некий человек',
            content: 'Гости создали больше опасных моментов и в два раза перебросали минчан, но «зубры» на этот раз очень эффективно использовали свои моменты.',
            tags: ["music"]
        },
        {
            id: '16',
            title: 'Минское «Динамо» обыграло ярославский «Локомотив»',
            summary: 'Минское «Динамо» обыграло ярославский «Локомотив» в четвертом матче первого раунда плей-офф КХЛ — 4:2',
            createdAt: new Date('2016-02-27T23:00:00'),
            author: 'Иванов Иван',
            content: 'Гости создали больше опасных моментов и в два раза перебросали минчан, но «зубры» на этот раз очень эффективно использовали свои моменты.',
            tags: ["music", "usa"]
        },
        {
            id: '17',
            title: 'Минское «Динамо» обыграло ярославский «Локомотив»',
            summary: 'Минское «Динамо» обыграло ярославский «Локомотив» в четвертом матче первого раунда плей-офф КХЛ — 4:2',
            createdAt: new Date('2017-02-27T23:00:00'),
            author: 'Илья Сидоров',
            content: 'Гости создали больше опасных моментов и в два раза перебросали минчан, но «зубры» на этот раз очень эффективно использовали свои моменты.',
            tags: ["music", "usa"]
        },
        {
            id: '18',
            title: 'Минское «Динамо» обыграло ярославский «Локомотив»',
            summary: 'Минское «Динамо» обыграло ярославский «Локомотив» в четвертом матче первого раунда плей-офф КХЛ — 4:2',
            createdAt: new Date('2018-02-27T23:00:00'),
            author: 'Илья Сидоров',
            content: 'Гости создали больше опасных моментов и в два раза перебросали минчан, но «зубры» на этот раз очень эффективно использовали свои моменты.',
            tags: ["music", "usa"]
        },
        {
            id: '19',
            title: 'Минское «Динамо» обыграло ярославский «Локомотив»',
            summary: 'Минское «Динамо» обыграло ярославский «Локомотив» в четвертом матче первого раунда плей-офф КХЛ — 4:2',
            createdAt: new Date('2019-02-27T23:00:00'),
            author: 'Иван',
            content: 'Гости создали больше опасных моментов и в два раза перебросали минчан, но «зубры» на этот раз очень эффективно использовали свои моменты.',
            tags: ["music", "usa"]
        },
        {
            id: '20',
            title: 'Киану Ривз.Тогда и сейчас',
            summary: 'Это хороший,проверенный пример для отображения отдельной новости.Смотреть лучше его',
            createdAt: new Date('2020-02-27T23:00:00'),
            author: 'Иванов Иван',
            content: '<div class="image-header"> <img src="Images/13.jpg" alt=""> </div><figcaption>Киану Ривз. Фото Reuters</figcaption> <p>В конце 20-го века Киану Ривз стал голливудской звездой, а главная роль в фантастической картине «Матрица» поставила его на ту ступень карьеры, когда режиссёры и продюсеры сами выстраиваются в очередь за актёром. Однако последующая череда личных трагедий и разочарований разрушила планы Ривза, и многие годы он учился переживать самые тяжелые утраты, чтобы затем вернуться в кинобизнес как актёр стойких и мужественных ролей. </p><h2>Рассвет карьеры</h2> <p>Киану Ривз родился в Бейруте, столице Ливана. Отец ушёл из семьи, когда ему было три года, и позднее сел в тюрьму за продажу героина. Проведя большую часть детства в путешествиях по миру, Ривз долгое время не мог понять, чем хочет заниматься. Мечта стать хоккеистом растворилась, когда он получил тяжёлую травму. Позже его исключили из школы, и тогда судьба занесла его в Лос-Анджелес. </p> <p>Пробивая себе дорогу мелкими ролями, к 1986 году Ривз получил одну из главных ролей в молодёжном триллере <a>«На берегу реки»</a>, основанном на реальном убийстве. Успех картины среди критиков привёл к тому, что Ривза стали звать на съёмки других молодёжных картин. Тогда ему было 22 года, и такая перспектива его вполне устраивала. </p> <p>Однако через год лучший друг Ривза погиб от передозировки. Через четыре года после этого, в 1991-м актёр отошёл от ролей подростков и молодых людей, исполнив главную роль агента ФБР в боевике «На гребне волны». </p> <div class="image-header"> <img src="Images/12.jpg" alt=""> </div> <figcaption>Кадр из фильма «На берегу реки»</figcaption> <p>Успешная у критиков и зрителей картина принесла актёру известность среди крупных продюсеров, а бонусом <a>стала</a> номинация «Самый желанный мужчина 1991 года» по версии телеканала MTV. Успех в «Волне» привлёк внимание и одного из самых знаменитых американских режиссёров 20-го века — Фрэнсиса Копполы. Ривза позвали в «Дракулу» на одну из главных ролей. </p> <p>Однако несмотря на громкие кассовые сборы и успех фильма в 1992 году, по мнению критиков, в том числе и влиятельного издания <a>Empire</a>, Ривз плохо отыграл роль. Впрочем, одновременно с этим критики отмечали, что мало кому удаётся держать планку, когда с тобой в одном фильме снимаются Гэри Олдман и Энтони Хопкинс. Эти актёры на тот момент уже заработали репутацию профессионалов, которые легко жонглировали сложными и неординарными ролями. </p> <div class="image-header"> <img src="Images/14.jpg" alt=""> </div> <figcaption>Кадр из фильма «Дракула»</figcaption> <p>Ривз и сам понимал, что пришло время экспериментов в своей карьере. В 1994 году он попробовал себя в главной роли боевика «Скорость», который получил отличные оценки. Затем сыграл ведущую позицию в романтической драме «Прогулка в облаках» и сделал перерыв на театр, блестяще <a>исполнив</a> роль Гамлета. </p> <p>В 1997 году у «Скорости» появился <a>разгромленный</a> критиками сиквел, но Ривза там не было. В тот год он снимался рядом с Аль Пачино в «Адвокате дьявола». Со съёмками фильма связан интересный факт: Ривз согласился уступить больше половины своего гонорара, чтобы в фильм позвали Аль Пачино. И хотя оценки фильма <a>разнились</a>, при бюджете в 57 миллионов долларов он собрал в прокате 157 миллионов долларов, усилив и без того привлекательный статус Ривза как актёра. </p> <p>В 1999 году вышел фантастический боевик «Матрица», где Ривз сыграл роль Избранного по имени Нео, призванного спасти мир. Громкая популярность фильма у публики и критиков с последующим возведением его в культовые работы жанра создали вокруг Ривза тот ореол славы, которым он известен многим и сейчас. </p> <div class="image-header"> <img src="Images/15.jpg" alt=""> </div> <figcaption>Кадр из фильма «Матрица»</figcaption> <h2>Семейная трагедия</h2> <p>Актёрский успех обернулся для Ривза рядом трагедий. Накануне Рождества у его возлюбленной Дженнифер Сайм, с которой он познакомился в 1998 году, случился выкидыш. Молодая пара потеряла дочь, которую планировала назвать Ава Арчер Сайм-Ривз. Трагедия <a>загнала Сайм</a> в глубокую депрессию с алкоголем и тяжёлыми наркотиками, а Ривз с головой ушёл в работу. </p> <p>Вскоре пара разошлась. Ривз не мог себе позволить потерять и актёрскую карьеру, а Сайм просто хотела забыться. В апреле 2001 года девушка погибла в автокатастрофе, так толком и не обсудив с Ривзом боль от общей утраты. Её похоронили рядом с могилой Авы. </p> <div class="image-header"> <img src="Images/16.jpg" alt=""> </div> <figcaption>Киану Ривз на похоронах Дженнифер Сайм. Фото CBS</figcaption> <p>К 2003 году у Ривза появилась новая ноша — умирающая от лейкемии сестра Ким. Чтобы находиться рядом с сестрой, актёр сменил жильё, вложил более пяти миллионов долларов в исследование болезни и жертвовал деньги больнице, в которой лечилась сестра. </p> <p>Ривз столь часто откладывал съёмки и пропадал в медицинском учреждении, что в Голливуде поползли слухи о его наркотической зависимости. Сам же Ривз позже <a>рассказывал</a>, что даже в самые тяжёлые минуты собственной депрессии он приходил в палату к сестре и поддерживал её. Попутно актёр <a>основал</a> собственный фонд борьбы с раком и суммарно потратил 75% заработка с трилогии «Матрицы» на борьбу с лейкемией и исследования болезни. </p> <p>По данным на февраль 2017 года сестра Ривза Ким здорова: её болезнь находится в стадии ремиссии. </p> <div class="image-header"> <img src="Images/17.jpg" alt=""> </div> <figcaption>Фото Splash News</figcaption> <h2>Киану Ривз в обычной жизни</h2> <p>В 2010 году по интернету разошёлся мем «Грустный Киану», возникший из снимка, сделанного фотографом издания Splash News. На фото Ривз сидел на уличной скамейке в неброской одежде и доедал сэндвич. </p> <p>На фоне популярности мема множество людей проявило интерес к трагичным событиям в жизни Ривза. Пошла новая волна слухов, что актёр находится в затяжной депрессии, в том числе и потому, что носит недорогую одежду. </p> <p>В 2011 году журналисты Би-би-си <a>спросили</a> у Ривза, как он относится к мему и считает ли он себя «грустной» личностью. В ответ на это актёр отметил, что мем показался ему смешным, однако проигнорировал второй вопрос о своих личных переживаниях. </p> <p>Трудно сказать, связана ли скромность Ривза в быту со скрытой депрессией. Ещё в 2014 году стало <a>известно</a>, что актёр, состояние которого превышает 350 миллионов долларов, живёт в недорогом по меркам своих заработков доме. В отличие от многих голливудских коллег, Ривз не покупал себе особняк, и по всей стране у него наберётся четыре-пять квартир в разных городах. Но даже их актёр приобрёл относительно недавно, проведя самые сложные годы, когда у него погибла жена и умирала сестра, в многочисленных отелях и съёмных квартирах. </p> <p>«Деньги — это последнее, о чём я думаю», — <a>говорил</a> Ривз в 2003 году, и с тех пор едва стал проявлять к роскоши больше интереса. В декабре 2011 года на YouTube появилась запись, на который одетый в джинсы и чёрный пиджак Ривз уступает место девушке в нью-йоркском метро. </p> <p>Примерно так можно описать всю его жизнь вне голливудских камер. Он преимущественно одевается в чёрную и непримечательную одежду, не следит за модой, отдаёт часть заработанных денег на благотворительность и пользуется метро. </p> <p>Разговоры о «широкой душе» Ривза ходили ещё в 2011 году. Тогда пользователь Reddit, знакомый с одним из работавших с Киану сотрудников, <a>рассказал</a> такую историю: после успеха первого фильма в трилогии «Матрицы» актёр якобы решил отказаться от части будущих заработков, которые, по сторонним подсчётам, составляли примерно 80 миллионов долларов. Ривз, исходя из рассказа, отдал деньги команде по спецэффектам и костюмерам. </p> <p>Рассказ неоднократно <a>опровергали</a> в СМИ, однако это лишь ещё одно доказательство того, что финансовая скромность Ривза сделала его в глазах поклонников человеком, которого не волнуют деньги. Впрочем, другая история благотворительности актёра оказалась правдивой: он <a>подарил</a> каждому каскадёру первой «Матрицы» по мотоциклу. </p> <p>В том же 2011 году Ривз совместно с художницей Александрой Грант выпустил книгу «Ода к счастью». Иллюстрированная книга состояла из стихов актёра, а изображения в книге выглядели так, будто их размыло слезами. Концовка у книги, однако, <a>вдохновляющая</a>: «Всегда может быть хуже», — написал автор. Позднее он <a>рассказал</a>, что книга была лишь способом развлечься, и её не следует воспринимать всерьёз. </p> <div class="image-header"> <img src="Images/18.jpg" alt=""> </div> <figcaption>Кадр из фильма «Джон Уик»</figcaption> <p>После трилогии «Матрицы», которая закончилась в 2003 году, и «Константина», вышедшего в 2005 году, у Ривза были сложные времена в актёрской карьере. Снимаясь то в любительских, то в провальных фильмах, он старел, превращаясь из культового артиста в «того актёра из „Матрицы“». </p> <p>Однако ситуация резко изменилась в 2014 году, когда актёр снялся в боевике «Джон Уик». Ривзу подошла роль главного героя, бывшего наёмного убийцы Джона Уика, потерявшего любимую жену из-за тяжёлой болезни. Это <a>отмечали</a> критики и зрители. Ведь кому как не ему знать об утрате. </p> <p>Теперь, когда после мощного успеха первой части в прокат вышла вторая часть «Джона Уика», Ривзу, судя по всему, рано останавливаться. Концовка боевика намекает на продолжение, и сложно представить на месте Ривза другого актёра, который бы сумел так честно сыграть скромного и в целом благородного наёмного убийцу, с выдающимися упорством идущего против трудностей. </p> <p>10 февраля в честь выхода «Джон Уик 2» британский журнал Esquire <a>опубликовал</a> интервью с Ривзом. Размашистый материал, более похожий на краткую автобиографию с цитатами актёра, в основном отдаёт жизнерадостностью, особенно когда автор пишет о карьерных успехах Ривза. </p> <p>Грустная часть жизни актёра поднимается уже под конец интервью: смерть нерождённого ребёнка, гибель возлюбленной — журналист вспоминает эти эпизоды, а затем спрашивает, когда Ривз планирует остепениться. </p>',
            tags: ["music", "usa"]
        }

    ];
    articles=(JSON.parse(localStorage.getItem("articles"),(key, value)=> {
            if (key == 'createdAt') return new Date(value);
            return value;
        }))||articles;
    var tags = ["job", "music", "school", "super", "cool", "2017", "hobby", "usa"];
    var images = [{id: "1", url: "Images/2.jpg"},
        {id: "2", url: "Images/3.jpg"},
        {id: "3", url: "Images/4.jpg"},
        {id: "4", url: "Images/6.jpg"},
        {id: "5", url: "Images/8.png"},
        {id: "6", url: "Images/9.jpg"},
        {id: "7", url: "Images/2.jpg"},
        {id: "8", url: "Images/3.jpg"},
        {id: "9", url: "Images/4.jpg"},
        {id: "10", url: "Images/6.jpg"},
        {id: "11", url: "Images/8.png"},
        {id: "12", url: "Images/9.jpg"},
        {id: "13", url: "Images/2.jpg"},
        {id: "14", url: "Images/3.jpg"},
        {id: "15", url: "Images/4.jpg"},
        {id: "16", url: "Images/6.jpg"},
        {id: "17", url: "Images/8.png"},
        {id: "18", url: "Images/9.jpg"},
        {id: "19", url: "Images/2.jpg"},
        {id: "20", url: "Images/13.jpg"}];
    images =(JSON.parse(localStorage.getItem("images")))||images ;
    tags =(JSON.parse(localStorage.getItem("tags")))||tags ;
    var getArticles=(skip=0, top=10, filterConfig={})=> {
        var _author = filterConfig.author || "";
        var _beginDate = filterConfig.beginDate || new Date(-8640000000000000);
        var _endDate = filterConfig.endDate || new Date(8640000000000000);
        var _tags = filterConfig.tags;
        var _articles = articles;
        _articles = _articles.filter(param=>param.author.indexOf(_author)>-1);
        _articles = _articles.filter(param=>param.createdAt >= _beginDate && param.createdAt <= _endDate);
        if(_tags!==undefined) {_articles = _articles.filter((param)=> {
            for (var i = 0; i < _tags.length; i++) {if (param.tags.indexOf(_tags[i]) === -1)return false;}
            return true;
        });};
        return _articles.sort((a, b)=>b.createdAt - a.createdAt).slice(skip, skip + top);
    };
    var getArticle=(id) =>articles.find(param=>param.id === id);
    var inTags=(tag)=>tags.find(param=>param === tag);
    var getImage=(id)=> images.find(param=>param.id === id);
    var addNewImage=(id, url)=> images.push({id: id, url: url});
    var validateArticle=(article, withoutID)=> {
        if (typeof article.title !== 'string' || article.title.length <= 0 || article.title.length > 100) return false;
        if (typeof article.summary !== 'string' || article.summary.length <= 0 || article.summary.length > 200) return false;
        if (withoutID === undefined && (typeof article.id !== 'string' || article.id.length <= 0 || getArticle(article.id) !== undefined)) return false;
        if ((article.createdAt instanceof Date) === false)return false;
        if (typeof article.author !== 'string' || article.author.length <= 0) return false;
        if (typeof article.content !== 'string' || article.content.length <= 0) return false;
        if (article.tags.length <= 0) return false;
        for (var i = 0; i < article.tags.length; i++) {if(tags.indexOf(article.tags[i])===-1) return false;}
        return true;
    };
    var addArticle=(article)=>{
        if (validateArticle(article)) {articles.push(article);return true;}
        return false;
    };
    var editArticle=(id, article)=> {
        var _clone;
        if ((_clone = getArticle(id)) === undefined)return false;
        var _article=Object.assign({},_clone);
        if (article.title !== undefined) _article.title = article.title;
        if (article.summary !== undefined) _article.summary = article.summary;
        if (article.content !== undefined) _article.content = article.content;
        if (article.tags !== undefined) _article.tags = article.tags;
        if (validateArticle(_article, "")){removeArticle(id);addArticle(_article);console.log(getArticle(id));return true;}
        return false;
    };
    var addTag=(tag)=> {
        if (inTags(tag) === undefined) {tags.push(tag);return true;}
        return false;
    };
    var deleteTag=(tag)=> {
        var x = inTags(tag);
        if (inTags(tag) !== undefined) {tags.splice(x, 1);return true;}
        return false;
    };
    var removeArticle=(id)=> {
        var x=articles.findIndex(param=>param.id === id);
        if (x === undefined) return false;
        articles.splice(x, 1);
        return true;
    };
    var getTags=()=>tags;
    var toLocaleStorage=()=> {
        localStorage.setItem("articles", JSON.stringify(articles));
        localStorage.setItem("images", JSON.stringify(images));
        localStorage.setItem("tags", JSON.stringify(tags));
    };
    return {
        getArticles: getArticles,
        getArticle: getArticle,
        validateArticle: validateArticle,
        addArticle: addArticle,
        editArticle: editArticle,
        inTags: inTags,
        addTag: addTag,
        deleteTag: deleteTag,
        removeArticle: removeArticle,
        getImage: getImage,
        addNewImage: addNewImage,
        getTags:getTags,
        toLocaleStorage:toLocaleStorage,
    };
}());
