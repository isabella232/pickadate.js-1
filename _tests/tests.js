
/*jshint
    debug: true,
    devel: true,
    browser: true,
    asi: true,
    unused: true
 */


var $DOM = $( '#qunit-fixture' )



module( 'Events on the time picker', {
    setup: function() {
        var thisModule = this
        thisModule.$input = $( '<input type=time>' )
        $DOM.append( thisModule.$input )
        thisModule.$input.pickatime({
            onStart: function() {
                thisModule.started = true
                thisModule.restarted = thisModule.stopped
            },
            onRender: function() {
                thisModule.rendered = true
            },
            onOpen: function() {
                thisModule.opened = true
            },
            onClose: function() {
                thisModule.closed = true
            },
            onSet: function() {
                thisModule.selectedArray = this.get( 'select' ).TIME == 600
                thisModule.selectedNumber = this.get( 'select' ).TIME == 120
                thisModule.clearedValue = this.get( 'value' ) === ''
            },
            onStop: function() {
                thisModule.stopped = true
            }
        })
    },
    teardown: function() {
        delete this.$input
        $DOM.empty()
    }
})

test( 'Checking the basic events...', function() {
    var thisModule = this
    ok( thisModule.started, 'Started up fine' )
    ok( thisModule.rendered, 'Rendered correctly' )
    thisModule.$input.pickatime( 'open' )
    ok( thisModule.opened, 'Opened just fine with a trigger' )
    thisModule.$input.pickatime( 'close' )
    ok( thisModule.closed, 'Opened just fine with a trigger' )
    thisModule.$input.pickatime( 'stop' )
    ok( thisModule.stopped, 'Stopped just fine' )
    thisModule.$input.pickatime( 'start' )
    ok( thisModule.restarted, 'Restarted just fine' )
})

test( 'Checking the `set` events...', function() {
    var thisModule = this
    thisModule.$input.pickatime( 'set', { select: [10,0] } )
    ok( thisModule.selectedArray, 'Selected from an array' )
    thisModule.$input.pickatime( 'set', { select: 120 } )
    ok( thisModule.selectedNumber, 'Selected from a number' )
    thisModule.$input.pickatime( 'clear' )
    ok( thisModule.clearedValue, 'Cleared the input value' )
})



module( 'Set up the picker stage', {
    setup: function() {
        this.$input = $( '<input type=time>' )
        $DOM.append( this.$input )
        this.$input.pickatime()
    },
    teardown: function() {
        delete this.$input
        $DOM.empty()
    }
})

test( 'Checking input attributes...', function() {
    ok( this.$input[ 0 ].type == 'text', 'Input type updated' )
    ok( this.$input[ 0 ].readOnly === true, 'Input is readonly' )
    ok( this.$input.pickatime( 'get', 'select' ).TIME == this.$input.pickatime( 'get', 'now' ).TIME, 'Default selected time is correct' )
})

test( 'Checking picker holder...', function() {
    var $holder = this.$input.next( '.' + $.fn.pickatime.defaults.klass.holder.split( ' ' )[ 0 ] )
    ok( $holder.length, 'There is a picker holder right after the input element' )
    ok( $holder.find( '[data-pick]' ).length == 48, 'There are 48 selectable times at 30 minute intervals' )
})

test( 'Checking picker objects...', function() {
    var nowDateObject = new Date(),
        nowTimeMinutes = nowDateObject.getHours() * 60 + nowDateObject.getMinutes(),
        interval = $.fn.pickatime.defaults.interval
    ok( this.$input.pickatime( 'get', 'now' ).TIME === interval + nowTimeMinutes - ( nowTimeMinutes % interval ), 'Now time is correct at ' + this.$input.pickatime( 'get', 'now' ).HOUR + ':' + this.$input.pickatime( 'get', 'now' ).MINS )
    ok( !this.$input.pickatime( 'get', 'disable' ).length, 'No disabled times' )
    ok( !this.$input.pickatime( 'get', 'off' ), 'The times are not all off' )
    ok( this.$input.pickatime( 'get', 'min' ).TIME === 0, 'Min time is midnight' )
    ok( this.$input.pickatime( 'get', 'max' ).TIME == 1410, 'Max time is 23:30' )
})




module( 'Time picker with a value', {
    setup: function() {
        this.$input = $( '<input type=time value="2:00 p.m.">' )
        $DOM.append( this.$input )
        this.$input.pickatime()
    },
    teardown: function() {
        delete this.$input
        $DOM.empty()
    }
})

test( 'Checking input `value` to set time...', function() {
    ok( this.$input.pickatime( 'get', 'select' ).TIME == 840, 'Element value sets correct time' )
    ok( this.$input.pickatime( 'get', 'highlight' ).TIME == 840, 'Element value sets correct highlight' )
    ok( this.$input.pickatime( 'get', 'view' ).TIME == 840, 'Element value sets correct view' )
    ok( !this.$input.next().next().length, 'There is no hidden input' )
})




module( 'Time picker with a data value', {
    setup: function() {
        this.$input = $( '<input type=time data-value="14:00">' )
        $DOM.append( this.$input )
        this.$input.pickatime({
            formatSubmit: 'HH:i'
        })
    },
    teardown: function() {
        delete this.$input
        $DOM.empty()
    }
})

test( 'Checking input `data-value` to set time...', function() {
    ok( this.$input.pickatime( 'get', 'select' ).TIME == 840, 'Selects correct time' )
    ok( this.$input.pickatime( 'get', 'highlight' ).TIME == 840, 'Highlights correct time' )
    ok( this.$input.pickatime( 'get', 'view' ).TIME == 840, 'Viewsets correct time' )
    ok( this.$input.next().next()[ 0 ].type == 'hidden', 'There is a hidden input' )
    ok( this.$input.next().next()[ 0 ].value == '14:00', 'The hidden input has correct value' )
})

