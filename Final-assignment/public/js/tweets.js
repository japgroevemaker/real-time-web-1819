socket.on('tweet', function(stream) {
  console.log("nieuwe twit");
  console.log(stream);

  let tweetContainer = document.getElementById('twitter-output'),
    tweet = document.createElement('section'),
    tweetHeader = document.createElement('div'),
    tweetMain = document.createElement('div'),
    tweetText = document.createElement('p'),
    tweetNickName = document.createElement('h2'),
    tweetUserName = document.createElement('h3'),
    tweetUserImg = document.createElement('img'),
    tweetUserDetailContainer = document.createElement('div');

  tweetHeader.classList.add('tweet-header')
  tweetMain.classList.add('tweet-main')
  tweetUserDetailContainer.classList.add('detail-container')

  tweetUserImg.src = stream.user.profile_image_url;

  let counter = 0;
  let tweetUserNameText = document.createTextNode(stream.user.name),
      tweetNickNameText = document.createTextNode('@' + stream.user.screen_name)

      if (stream) {
        counter ++
      }


      if (stream.retweeted_status) {
        if (stream.retweeted_status.extended_tweet) {

          // let text = stream.retweeted_status.extended_tweet.full_text
          //
          // function urlify(text) {
          //   let regex = /\bhttps?:\/\/\S+/gi
          //   return text.replace(regex, function(url){
          //     console.log(url);
          //     return '<a href="' + url + '">' + url + '</a>';
          //   })
          // }
          // let html = urlify(text)

          let retweetTextData = document.createTextNode(stream.retweeted_status.extended_tweet.full_text)
          tweetText.appendChild(retweetTextData)

        } else {
          let retweetTextData = document.createTextNode(stream.retweeted_status.text)
          tweetText.appendChild(retweetTextData)
        }
      } else if (stream.extended_tweet) {
        console.log('False');
        let extendedTweetData = document.createTextNode(stream.extended_tweet.full_text)
        tweetText.appendChild(extendedTweetData)
      } else {
        let tweetTextData = document.createTextNode(stream.text);
        tweetText.appendChild(tweetTextData)
      }


  tweetUserName.appendChild(tweetUserNameText)
  tweetNickName.appendChild(tweetNickNameText);

  tweetHeader.appendChild(tweetUserImg)
  tweetUserDetailContainer.appendChild(tweetNickName)
  tweetUserDetailContainer.appendChild(tweetUserName)
  tweetHeader.appendChild(tweetUserDetailContainer);

  tweetMain.appendChild(tweetText)

  tweet.appendChild(tweetHeader)
  tweet.appendChild(tweetMain)

  tweetContainer.appendChild(tweet)
  console.log(counter);
})

checkbox.forEach(function(checked) {
  checked.addEventListener("click", function() {

    let div = document.createElement('div');
    div.classList.add('line')
    let genChange = document.createTextNode(checked.value);
    let twitterOutput =  document.getElementById('twitter-output');

    if (checked.checked) {
      div.appendChild(genChange)
      twitterOutput.appendChild(div)
    }

    console.log(checked.value);
    socket.emit('tweetGenre', checked.id, checked.checked)
  })
})
