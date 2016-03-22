import Ember from 'ember';

export default Ember.Component.extend({
  buttonDisabled: false,
  oldFilter: null,
  force: null,
  classNames: ['content-height'],
  offset: 0,
  limit: 10,
  results: Ember.A(),
  filteredResults: Ember.computed('filter', 'force', function(){
    let self = this;
    if(self.get('oldFilter') !== self.get('filter')){
      self.set('offset', 0);
      self.set('oldFilter', self.get('filter'));
      self.set('buttonDisabled', false);
    }
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
      filter: self.get('filter') || "",
      limit: self.get('limit')
    });
    socket.on('tweet_list', function(e){
      self.set('buttonDisabled', !e.length);
      let l = self.get('results');
      Array.prototype.push.apply(l, e);
      self.set('results', l);
      self.set('force', Math.random()); //force property recompute
      self.rerender();
    });
  },

  actions : {
    loadMore: function(){
      let self = this;
      let v = self.get('offset') + self.get('limit');
      self.set('offset', v);
      io().emit('load_tweets', {
        offset: self.get('offset'),
        filter: self.get('filter') || "",
        limit: self.get('limit')
      });
      self.rerender();
    }
  }
});
