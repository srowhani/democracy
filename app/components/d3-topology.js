import Ember from 'ember';
var socket = io();
export default Ember.Component.extend({
  tagName: 'svg',
  didInsertElement() {
    let obj = {};
    let republican = 'votetrump,votefortrump,trump2016'.split(',');
    let democrat = 'votehillary,hillary2016,voteclinton,clinton2016,voteforclinton,votesanders,voteforsanders,votebernie,voteforbernie'.split(',');
    socket.on('data', function(e){
      let text = e.text.toLowerCase();
      if(republican.some(function(e){
        return text.includes(e);
      })){
        if(obj[e.location] !== undefined)
          obj[e.location]--;
        else
          obj[e.location] = -1;
      }
      else if(democrat.some(function(e){
        return text.includes(e);
      })){
        if(obj[e.location] !== undefined)
          obj[e.location]++;
        else
          obj[e.location] = +1;
      }
      Object.keys(obj).forEach(function(e){
        document.querySelector('.' + e).style.fill = obj[e] > -1 ? `rgb(113, 115, ${219 + obj[e] * 2})` : `rgb(${201 - obj[e] * 2}, 58, 58)`;
      });
      console.log(obj);
    })
    var svg = d3.select(this.element)
      .attr('width', 900)
      .attr('height', 550);

    var path = d3.geo.path().projection(d3.geo.albersUsa());

    var g = svg.append('g');

    d3.json('us.json', function(error, topology) {
      g.selectAll('path')
        .data(topojson.feature(topology, topology.objects.usStates).features)
        .enter().append('path')
        .attr('class', function(d) {
          return 'states ' + d.properties.STATE_ABBR;
        })
        .attr('d', path)
        .attr('fill', 'gray')
        .attr('opacity', '0.8');
      socket.emit('ready', {});
    });
  }
});
