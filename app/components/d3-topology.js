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
        if(obj[e] === 0)
          document.querySelector('.' + e).style.fill = '';
        else
          document.querySelector('.' + e).style.fill = obj[e] > -1 ? `rgb(113, 115, ${219 + obj[e] * 2})` : `rgb(${201 - obj[e] * 2}, 58, 58)`;
      });
    })
    var svg = d3.select(this.element)
      .attr('width', 900)
      .attr('height', 550);
    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0])
      .html(function(d) {
        var state = d.properties.STATE_ABBR;
        var vote;
        if(!obj[state])
          vote = 'Neutral';
        else if(obj[state] > 0)
          vote = 'Democratic';
        else
          vote = 'Republican';

        return `<strong>State: </strong> ${state}<br/>`
          + `<strong>Majority: </strong> ${vote}`;
    })
    svg.call(tip);

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
        .on('mouseover', function(d){
          tip.attr('class', 'd3-tip animate').show(d);
        })
        .on('mouseout', function(d){
          tip.attr('class', 'd3-tip').show(d)
          tip.hide();
        });
      socket.emit('ready', {});
    });
  }
});
