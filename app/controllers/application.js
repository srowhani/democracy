import Ember from 'ember';
import d3 from 'd3';

export default Ember.Controller.extend({
  init(){
    var self = this;
    io().on('tweet', function(d){
      Object.keys(d).forEach(function(e){
        self.set(`${e}`, d[e]);
      });
    });
  }
})
