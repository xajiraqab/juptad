let _listUsers = [] //usernames

let _mapUsernameInRoom = {} //რომელი მომხმარებელი, რომელ ოთახშია



// const movie = {
//   src: string,
//   title: string,
//   description: string,
//   image: string
// }

// store[url] = movie






let _rooms = {
  'j1': {
    movie: {
      src: "https://api.adjaranet.com/api/v1/movies/878450612/files/1415548?source=adjaranet",
      title: "ბეჭდების მბრძანებელი : ბეჭდის საძმო (გაფართოვებული)",
      description: "მას შემდეგ რაც ახალგაზრდა ჰობიტი ფროდო ბეგინსი  ბიძია ბილბოსგან მემკვიდრეობით საიდუმლოებით მოცულ ბეჭედს მიიღებს, იძულებული ხდება სახლი მიატოვოს, რათა დაიცვას იგი ბოროტი მბრძანებლის ხელში ჩავარდნისაგან. ამასობაში შეიქმნება საძმო, რომელმაც უნდა დაიცვას ბეჭედის მატარებელი წევრი და დარწმუნდეს, რომ ბეჭედი ნამდვილად არის დანიშნულების ადგილას მიტანილი. მთა დომი  ერთადერთი ადგილია სადაც მისი განადგურებაა შესაძლებელი.",
      image: "https://static.adjaranet.com/movies/posters/240/612/878450612-1ed13fc77d86ca33aa675b5703778d09.jpg"
    },
    listUsers: [],
    providerUser: null, //იმ მომხმარებლის სახელი, რომელიც სინკავს დროს
    isPlaying: false,   //ჩართულია თუ დაპაუზებული
    currentTime: 0.0,   //მიმდინარე წუთი
  },
  'j2': {
    movie: {
      src: "https://ftp1.movie.ge/movies/01_22/Dune_2021/Dune_2021_GEO_HD.mp4",
      title: "დიუნი / Dune (ქართულად)",
      description: "სათავგადასავლო ფანტასტიკა, ახალგაზრდა არისტოკრატის, პოლ ატრეიდესის შესახებ, რომელიც სამყაროში ყველაზე საშიშ პლანეტა- არაკისში მიდის, რათა მისი ოჯახის და მისი ხალხის მომავალი უზრუნველყოს. არაკისში უნიკალური ნივთიერება – “მელანჟი” მოიპოვება, რომელიც კოსმოსურ ხომალდს კომპიუტერების დახმარების გარეშე კოსმოსური სივრცის გადალახვაში ეხმარება. ატრეიდესი და მისი ოჯახი იმპერატორის ბრძანებით პლანეტის მართვის უფლებას მიიღებენ, მაგრამ მალე ჰარკონენების ჯარების მიერ თავდასხმის შედეგად თითქმის ყველა დაიღუპება. მხოლოდ პოლი და მისი დედა გადარჩება, რომლებიც უდაბნოში დაიმალებიან, სადაც ატრეიდესი უდაბნოს ხალხის – ფრემენების საზოგადოების წევრი გახდება. ფრემენები ხვდებიან, რომ ახალგაზრდა გმირი რჩეულია, და პოლს, ჰარკონენების და იმპერიის წინააღმდეგ ბრძოლაში მხარს უჭერენ. სანამ ბოროტი ძალები რესურსებში ყველაზე ფასეული – საქონლის გამო კონფლიქტში შედიან, რომელსაც კაცობრიობის უდიდესი პოტენციალის გამოვლენა შეუძლია – გადარჩებიან მხოლოდ ისინი, ვინც საკუთარი შისების დამარცხებას შეძლებს.",
      image: "https://static.adjaranet.com/movies/posters/240/347/878481347-f84f5c6a9c0525b70bee9683541f23f9.jpg"
    },
    listUsers: [],
    providerUser: null,
    isPlaying: false,
    currentTime: 0.0,
  },

  // 'j3': {movie: null, listUsers: [], providerUser: null, isPlaying: false, currentTime: 0.0,},
  // 'j4': { movie: null, listUsers: [], providerUser: null, isPlaying: false, currentTime: 0.0, },
  // 'j5': { movie: null, listUsers: [], providerUser: null, isPlaying: false, currentTime: 0.0, },
}


module.exports = { _listUsers, _mapUsernameInRoom, _rooms }
