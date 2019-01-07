WARNING: This is not yet functional. Coming soon :)
--

# mem

commit and persist structured information in your human memory

## running

### first
`npm install`
`npm link`

### then if you want to store memory locally
`mem review`


## theory

### remembering, i.e. not forgetting

remembering just happens. our brains do it naturally. and it happens instantly.

immediately after remembering, forgetting begins. forgetting also just happens,
but it doesn't happen instantly (though, sometimes it seems to). there is a
rate at which the act of forgetting occurs.

so, the study of remembering is really the study of forgetting.

however, we know not everything must be forgotten. this rings true as long as a
brain is healthy; the same may not be true for a brain that operates within
different parameters than an average brain. but, in average circumstances, we
know not everything must be forgotten.

we can remember some things for a very, very long time. perhaps even until we
die. so, we know the rate of forgetting is not constant for all things
remembered, and can even be counteracted.

we do it all the time. we study, we repeat, we relate ideas, and we form
memories.

### the rate of forgetting

so, how much, exactly, or even approximately, must we study to remember
something? how many times must we repeat? how often? in what way and to what
extent does relating the information with other information help?

the high level breakdown can be seen in these "forgetting curves":

https://en.wikipedia.org/wiki/Forgetting_curve

these curves are based on transient memory deterioration, i.e. memory that
fades over time. though, it is worth noting that according to at least one
analysis, there are seven categories of memory failure (appendix a)

the curve is described by the equation R = e ^ t/S

where R is the retrievability, t is the time since last recalled, and S is the
stability of the memory

the tough thing about these curves is determining the correct value for S, the
stability of a memory, particularly since S would ideally change as information
is continuously reviewed at spaced intervals.

to get a reasonable estimation, it is reasonable to look at the pimsleurian
graduate level spaced interval found here:

https://en.wikipedia.org/wiki/Spaced_repetition

the intervals are: 5 seconds, 25 seconds, 2 minutes, 10 minutes, 1 hour, 5 hours,
1 day, 5 days, 25 days, 4 months, and 2 years

one way to get S from this is the assume the the memory should always be
refreshed once the value of R drops below 0.95

from the equation for R, S can be seen as:

S = -t/ln(R)

so, to be at 95% at 5 seconds, S would have to be S = -5/ln(0.95) = 97.48

S continues to grow to 389.91 for 25 seconds, 1852.09 for 120 seconds, and
9357.95 for 600 seconds. This goes on to display an exponential rise

https://en.wikipedia.org/wiki/Spaced_retrieval

### appendix

#### a) the seven kinds of memory failure

according to theory (https://en.wikipedia.org/wiki/The_Seven_Sins_of_Memory)

there are seven categories of memory failure, and 2 kinds:

##### kinds

1. failure of omission
    - idea cannot be recalled; brain has omitted the memory
2. failure of comission
    - idea cannot be correctly recalled in either fidelity or accuracy

##### categories

1. transience
    - general deterioration of specific memory over time
2. absent-mindedness
    - lack of attentive memory like location of one's glasses
3. blocking
    - brain tries to retrieve or encode information but another memory interferes
    with it
4. misattribution
    - a memory is correct but it is attributed to the wrong source, such as
    confusing the events of a movie with real life events
5. suggestibility
    - a memory that has been formed through the opinions of others that the event
    did indeed occur or the fact is indeed true
6. bias
    - a memory that is recalled in the context of one current opions and worldview
    rather than at the time of the event or context of the fact
7. persistence
    - failure to recall memory because it is disturbing. such as a blunder at work



## Background

the goal of this program is to remember as much correct and relevant
information as is possible, in a way that is highly structured and relatable,
so its relations can also be mapped, studied, and remembered.
