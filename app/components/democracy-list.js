import Ember from 'ember';

export default Ember.Component.extend({
  classNames: ['content-height'],
  offset: 0,
  limit: 50,
  results: Ember.A(),
  filteredResults: Ember.computed('filter', function(){
    console.log('filter computed');
    let self = this;

    let r = this.get('results');
    let f = this.get('filter');
    if(!f) return r;
    let s =  r.filter(function(el){
      let keys = Object.keys(el);

      return keys.some(function(e){
        return (el[e] + "").toLowerCase().indexOf(f.toLowerCase()) > -1;
      });
    });
    return s;
  }),
  didInsertElement(){
    let socket = io();
    let self = this;
    socket.emit('load_tweets', {
      offset: self.get('offset'),
      filter: self.get('filter') || ""
    });
    socket.on('tweet_list', function(e){
      console.log("loading tweets");
      let l = self.get('results');

      Array.prototype.push.apply(l, e);
      self.set('results', l);
      self.set('filter', self.get('filter') ? self.get('filter') + '' : '');
    });

    //fires for qt3.14 paginate
    let element = document.querySelector('.paper-list');
    element.addEventListener('scroll', function(e){
      if(element.offsetHeight + element.scrollTop >= element.scrollHeight){
        console.log('scroll event has fired');
        self.set('offset', self.get('offset') + self.get('limit'))
        socket.emit('load_tweets', {
          offset: self.get('offset'),
          filter: self.get('filter') || ""
        });
        self.set('filter', self.get('filter') ? self.get('filter') + '' : '');
      }
    }, false);
  }
});
