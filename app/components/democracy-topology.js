import Ember from 'ember';
export default Ember.Component.extend({
  tagName: 'svg',
  didInsertElement() {
    let obj = {};
    let socket = io();
    let republican = 'votetrump,votefortrump,trump2016'.split(',');
    let democrat = 'votehillary,hillary2016,voteclinton,clinton2016,voteforclinton,votesanders,voteforsanders,votebernie,voteforbernie'.split(',');
    socket.on('data', function(e) {
      let text = e.text.toLowerCase();
      if (republican.some(function(e) {
          return text.includes(e);
        })) {
        obj[e.location] = obj[e.location] || {
          r: 0,
          d: 0
        };
        obj[e.location]['r']++;
      } else if (democrat.some(function(e) {
          return text.includes(e);
        })) {
        obj[e.location] = obj[e.location] || {
          r: 0,
          d: 0
        };
        obj[e.location]['d']++;
      }
      Object.keys(obj).forEach(function(e) {
        if (obj[e].r - obj[e].d === 0)
          document.querySelector(`.${e}`).style.fill = '';
        else
          document.querySelector(`.${e}`).style.fill = obj[e].d >= obj[e].r ? `rgb(58, 58, ${219 + (obj[e].d - obj[e].r) * 2})` : `rgb(${201 + (obj[e].r - obj[e].d) * 2}, 58, 58)`;
      });
    });

    var svg = d3.select(this.element)
      .attr('width', 900)
      .attr('height', 550);
    var tip = d3.tip()
      .attr('class', 'd3-tip')
      .offset([-10, 0]);
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
        .on('mouseover', function(d) {
          tip.html(function(d) {
            var state = d.properties.STATE_ABBR;
            var vote;
            if (!obj[state] || obj[state].d - obj[state].r === 0)
              vote = 'Neutral';
            else if (obj[state].d - obj[state].r > 0)
              vote = 'Democratic';
            else
              vote = 'Republican';

            return `State: ${state}<br/> Majority: ${vote}`;
          });
          tip.attr('class', 'd3-tip animate').show(d);
        })
        .on('mouseout', function(d) {
          tip.attr('class', 'd3-tip').show(d)
          tip.hide();
        })
        .on('click', function(d) {
          tip.hide();
          tip.html(function(data){
            var state = data.properties.STATE_ABBR;
            return `State: ${state}<br/>`
              +    `Republican: ${!obj[state] ? 0 : obj[state].r}<br/>`
              +    `Democratic: ${!obj[state] ? 0 : obj[state].d}`;
          });
          tip.attr('class', 'd3-tip animate').show(d);
        });
      socket.emit('ready', {});
    });
  }
});
