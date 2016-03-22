import Ember from 'ember';
import d3 from 'd3';

export default Ember.Controller.extend({
  init(){
    var self = this;
    io().on('tweet', function(d){
      self.set('tweet', d);
    });
  },
  actions: {
    forkMe(){
      let w = window.open('https://github.com/srowhani/democracy/', '_blank');
      w.focus();
    }
  }
})
