import Ember from 'ember';

export default Ember.Component.extend({
  tagName: 'blockquote',
  classNames: ['twitter-tweet'],
  paint: Ember.observer('id', function(){
    this.rerender();
  })
});
