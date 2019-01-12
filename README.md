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

the curve is described by the equation R = e ^ -t/S

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

S continues to grow to 389.91 for 20 seconds (25 seconds elapsed), 1852.09
for 95 seconds (2 minutes elapsed), and 9357.95 for 480 seconds (10 minutes
elapsed). This goes on to display an exponential rise over the number of
review periods at correctly spaced time intervals...

the problem with this is that it's hard to use if the person doesn't encounter
the particular set of information at these time intervals. in these cases, what
is S, stability?

the thing is, S is really a differential equation; it is a function of other
variables and itself with those variables at some set of values, such as itself
at a previous time. in other words:

S' = f(S, t) 

and that's only if you include time as the essential parameter, which is most
likely not the only determinant of S. and it's important to remember S is a
made up idea; there may be no stability of information in our brains as we
look at it here (though information can certainly be "stable", within other
parameters, in terms of our regular definition of "stable"). so, s could also
be (and most certainly is) a factor of it's actual subject matter, the size of
the information, the amount of information already contained along with the
respective stability of all that other information, and the meaningfulness of
the information or otherwise its emotional connections.

it would be beautiful to see all these factors playing together in a program.
perhaps that is the eventual goal of this program and its parents. but let it
suffice for now that this program uses a time series as its sole determinant of
retrievability of information.

getting back to the problem, S' must be determined with increasing accuracy as
this program develops. as such, i've just brushed off my college text on
differential equations and am also exploring the works of:

1. [Piotr Wozniak](https://en.wikipedia.org/wiki/Piotr_Wo%C5%BAniak_(researcher))
2. [Paul Pimsleur](https://en.wikipedia.org/wiki/Paul_Pimsleur)
3. [Hermann Ebbinghaus](https://en.wikipedia.org/wiki/Hermann_Ebbinghaus)
4. [Lee Averell](http://newcastle-au.academia.edu/LeeAverell)
5. [Andrew Heathcote](http://www.tascl.org/andrew-heathcote.html)
6. [Geoffrey Loftus](https://en.wikipedia.org/wiki/Geoffrey_Loftus)
7. [Daniel Schacter](https://en.wikipedia.org/wiki/Daniel_Schacter)

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
